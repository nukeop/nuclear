import { ByteWriter, paddedBox, SidxBoxBuilder } from '../test/builders/boxes';
import { findBoxes, parseInitSegment, parseSidx } from './parser';

describe('findBoxes', () => {
  it('correctly identifies ftyp, moov, sidx boxes from a minimal header', () => {
    const buffer = new Uint8Array([
      ...paddedBox('ftyp', 20),
      ...paddedBox('moov', 100),
      ...paddedBox('sidx', 50),
    ]);

    const boxes = findBoxes(buffer);

    expect(boxes).toEqual([
      { type: 'ftyp', offset: 0, size: 20 },
      { type: 'moov', offset: 20, size: 100 },
      { type: 'sidx', offset: 120, size: 50 },
    ]);
  });

  it('handles empty input', () => {
    const boxes = findBoxes(new Uint8Array(0));
    expect(boxes).toEqual([]);
  });

  it('handles box with size 0 (extends to EOF)', () => {
    const ftypBox = paddedBox('ftyp', 20);
    const mdatHeader = new ByteWriter().uint32(0).ascii('mdat').toBytes();
    const mdatPayload = new Array(64).fill(0xab);
    const buffer = new Uint8Array([...ftypBox, ...mdatHeader, ...mdatPayload]);

    const boxes = findBoxes(buffer);

    expect(boxes).toHaveLength(2);
    expect(boxes[1]).toEqual({
      type: 'mdat',
      offset: 20,
      size: buffer.length - 20,
    });
  });

  it('handles 64-bit extended size', () => {
    const extendedSize = 24;
    const extendedBox = new ByteWriter()
      .uint32(1)
      .ascii('moov')
      .uint32(0)
      .uint32(extendedSize)
      .zeros(extendedSize - 16)
      .toBytes();
    const buffer = new Uint8Array(extendedBox);

    const boxes = findBoxes(buffer);

    expect(boxes).toEqual([{ type: 'moov', offset: 0, size: extendedSize }]);
  });
});

describe('parseSidx', () => {
  it('version 0: extracts segment references with correct byte ranges and times', () => {
    const sidxBox = new SidxBoxBuilder()
      .withTimescale(44100)
      .withReference(50000, 44100)
      .withReference(60000, 88200)
      .withReference(45000, 44100)
      .build();

    const boxOffset = 0;
    const boxSize = sidxBox.length;
    const result = parseSidx(new Uint8Array(sidxBox), boxOffset, boxSize);

    expect(result.timescale).toBe(44100);
    expect(result.references).toHaveLength(3);

    expect(result.references[0]).toEqual({
      startByte: boxSize,
      endByte: boxSize + 50000 - 1,
      startTime: 0,
      endTime: 44100 / 44100,
    });

    expect(result.references[1]).toEqual({
      startByte: boxSize + 50000,
      endByte: boxSize + 50000 + 60000 - 1,
      startTime: 44100 / 44100,
      endTime: (44100 + 88200) / 44100,
    });

    expect(result.references[2]).toEqual({
      startByte: boxSize + 50000 + 60000,
      endByte: boxSize + 50000 + 60000 + 45000 - 1,
      startTime: (44100 + 88200) / 44100,
      endTime: (44100 + 88200 + 44100) / 44100,
    });
  });

  it('version 1: handles 64-bit fields', () => {
    const sidxBox = new SidxBoxBuilder()
      .withVersion(1)
      .withTimescale(48000)
      .withReference(70000, 48000)
      .withReference(80000, 96000)
      .build();

    const boxSize = sidxBox.length;
    const result = parseSidx(new Uint8Array(sidxBox), 0, boxSize);

    expect(result.timescale).toBe(48000);
    expect(result.references).toHaveLength(2);

    expect(result.references[0]).toEqual({
      startByte: boxSize,
      endByte: boxSize + 70000 - 1,
      startTime: 0,
      endTime: 1,
    });

    expect(result.references[1]).toEqual({
      startByte: boxSize + 70000,
      endByte: boxSize + 70000 + 80000 - 1,
      startTime: 1,
      endTime: 3,
    });
  });
});

describe('parseInitSegment', () => {
  it('returns correct initSegmentEnd and segment array', () => {
    const ftypBox = paddedBox('ftyp', 20);
    const moovBox = paddedBox('moov', 100);
    const sidxBox = new SidxBoxBuilder()
      .withTimescale(44100)
      .withReference(30000, 44100)
      .withReference(40000, 44100)
      .build();

    const buffer = new Uint8Array([...ftypBox, ...moovBox, ...sidxBox]);
    const result = parseInitSegment(buffer);

    expect(result.initSegmentEnd).toBe(120);
    expect(result.timescale).toBe(44100);
    expect(result.segments).toHaveLength(2);

    const sidxEnd = 120 + sidxBox.length;
    expect(result.segments[0].startByte).toBe(sidxEnd);
    expect(result.segments[1].startByte).toBe(sidxEnd + 30000);
  });

  it('throws when no sidx box is found', () => {
    const buffer = new Uint8Array([
      ...paddedBox('ftyp', 20),
      ...paddedBox('moov', 100),
    ]);

    expect(() => parseInitSegment(buffer)).toThrow(
      'No sidx box found in init segment',
    );
  });
});

describe('segment contiguity', () => {
  const ftypBox = paddedBox('ftyp', 20);
  const moovBox = paddedBox('moov', 100);
  const sidxBox = new SidxBoxBuilder()
    .withTimescale(44100)
    .withReference(50000, 44100)
    .withReference(60000, 88200)
    .withReference(45000, 44100)
    .withReference(55000, 66150)
    .build();

  const buffer = new Uint8Array([...ftypBox, ...moovBox, ...sidxBox]);
  const result = parseInitSegment(buffer);

  it('segment byte ranges are contiguous', () => {
    for (let index = 1; index < result.segments.length; index++) {
      expect(result.segments[index].startByte).toBe(
        result.segments[index - 1].endByte + 1,
      );
    }
  });

  it('segment time ranges are contiguous and ascending', () => {
    for (let index = 1; index < result.segments.length; index++) {
      expect(result.segments[index].startTime).toBe(
        result.segments[index - 1].endTime,
      );
      expect(result.segments[index].endTime).toBeGreaterThan(
        result.segments[index].startTime,
      );
    }
  });
});
