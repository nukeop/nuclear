import { findBoxes, parseInitSegment, parseSidx } from './parser';
import {
  buildBoxWithPadding,
  buildSidxBox,
  writeAscii,
  writeUint32,
} from './test-helpers';

describe('findBoxes', () => {
  it('correctly identifies ftyp, moov, sidx boxes from a minimal header', () => {
    const buffer = new Uint8Array([
      ...buildBoxWithPadding('ftyp', 20),
      ...buildBoxWithPadding('moov', 100),
      ...buildBoxWithPadding('sidx', 50),
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
    const ftypBox = buildBoxWithPadding('ftyp', 20);
    const mdatHeader = [...writeUint32(0), ...writeAscii('mdat')];
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
    const extendedBox = [
      ...writeUint32(1),
      ...writeAscii('moov'),
      ...writeUint32(0),
      ...writeUint32(extendedSize),
      ...new Array(extendedSize - 16).fill(0),
    ];
    const buffer = new Uint8Array(extendedBox);

    const boxes = findBoxes(buffer);

    expect(boxes).toEqual([{ type: 'moov', offset: 0, size: extendedSize }]);
  });
});

describe('parseSidx', () => {
  it('version 0: extracts segment references with correct byte ranges and times', () => {
    const timescale = 44100;
    const references = [
      { referencedSize: 50000, subsegmentDuration: 44100 },
      { referencedSize: 60000, subsegmentDuration: 88200 },
      { referencedSize: 45000, subsegmentDuration: 44100 },
    ];
    const sidxBox = buildSidxBox({
      version: 0,
      timescale,
      earliestPresentationTime: 0,
      firstOffset: 0,
      references,
    });

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
    const timescale = 48000;
    const references = [
      { referencedSize: 70000, subsegmentDuration: 48000 },
      { referencedSize: 80000, subsegmentDuration: 96000 },
    ];
    const sidxBox = buildSidxBox({
      version: 1,
      timescale,
      earliestPresentationTime: 0,
      firstOffset: 0,
      references,
    });

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
    const timescale = 44100;
    const references = [
      { referencedSize: 30000, subsegmentDuration: 44100 },
      { referencedSize: 40000, subsegmentDuration: 44100 },
    ];

    const ftypBox = buildBoxWithPadding('ftyp', 20);
    const moovBox = buildBoxWithPadding('moov', 100);
    const sidxBox = buildSidxBox({
      version: 0,
      timescale,
      earliestPresentationTime: 0,
      firstOffset: 0,
      references,
    });

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
      ...buildBoxWithPadding('ftyp', 20),
      ...buildBoxWithPadding('moov', 100),
    ]);

    expect(() => parseInitSegment(buffer)).toThrow(
      'No sidx box found in init segment',
    );
  });
});

describe('segment contiguity', () => {
  const timescale = 44100;
  const references = [
    { referencedSize: 50000, subsegmentDuration: 44100 },
    { referencedSize: 60000, subsegmentDuration: 88200 },
    { referencedSize: 45000, subsegmentDuration: 44100 },
    { referencedSize: 55000, subsegmentDuration: 66150 },
  ];

  const ftypBox = buildBoxWithPadding('ftyp', 20);
  const moovBox = buildBoxWithPadding('moov', 100);
  const sidxBox = buildSidxBox({
    version: 0,
    timescale,
    earliestPresentationTime: 0,
    firstOffset: 0,
    references,
  });

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
