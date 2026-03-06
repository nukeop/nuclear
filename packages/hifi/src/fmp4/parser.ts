import { BinaryReader } from './BinaryReader';

export type Fmp4Box = {
  type: string;
  offset: number;
  size: number;
};

export type SegmentReference = {
  startByte: number;
  endByte: number;
  startTime: number;
  endTime: number;
};

export type Fmp4Index = {
  initSegmentEnd: number;
  segments: SegmentReference[];
  timescale: number;
  codec: string;
};

const BOX_HEADER_SIZE = 8;
const EXTENDED_SIZE_MARKER = 1;

export function findBoxes(data: Uint8Array): Fmp4Box[] {
  const boxes: Fmp4Box[] = [];
  const reader = new BinaryReader(data);

  while (reader.hasRemaining(BOX_HEADER_SIZE)) {
    const offset = reader.position;

    let size = reader.readUint32();
    const type = reader.readAscii(4);

    if (size === EXTENDED_SIZE_MARKER) {
      size = reader.readUint64();
    } else if (size === 0) {
      size = data.length - offset;
    }

    boxes.push({ type, offset, size });

    const nextBox = offset + size;
    reader.skip(nextBox - reader.position);
  }

  return boxes;
}

// Parses an ISO 14496-12 Segment Index Box (sidx).
// Layout reference: ISO 14496-12:2015, Section 8.16.3
// YouTube serves fMP4 audio with a sidx box that maps each fragment
// to a byte range and duration, which we need for MSE seeking.
export function parseSidx(
  data: Uint8Array,
  boxOffset: number,
  boxSize: number,
): { references: SegmentReference[]; timescale: number } {
  const reader = new BinaryReader(data, boxOffset + BOX_HEADER_SIZE);

  const version = reader.readUint8();
  reader.skip(3); // flags

  reader.skip(4); // reference_ID
  const timescale = reader.readUint32();

  let firstOffset: number;
  if (version === 0) {
    reader.skip(4); // earliest_presentation_time (32-bit)
    firstOffset = reader.readUint32();
  } else {
    reader.skip(8); // earliest_presentation_time (64-bit)
    firstOffset = reader.readUint64();
  }

  reader.skip(2); // reserved
  const referenceCount = reader.readUint16();

  let byteOffset = boxOffset + boxSize + firstOffset;
  let timeOffset = 0;
  const references: SegmentReference[] = [];

  for (let index = 0; index < referenceCount; index++) {
    const referencedSize = reader.readUint32() & 0x7fffffff;
    const subsegmentDuration = reader.readUint32();
    reader.skip(4); // starts_with_SAP + SAP_type + SAP_delta_time

    const startByte = byteOffset;
    const endByte = byteOffset + referencedSize - 1;
    const startTime = timeOffset / timescale;
    const endTime = (timeOffset + subsegmentDuration) / timescale;

    references.push({ startByte, endByte, startTime, endTime });

    byteOffset += referencedSize;
    timeOffset += subsegmentDuration;
  }

  return { references, timescale };
}

export function parseInitSegment(data: Uint8Array): Fmp4Index {
  const boxes = findBoxes(data);
  const sidxBox = boxes.find((box) => box.type === 'sidx');

  if (!sidxBox) {
    throw new Error('No sidx box found in init segment');
  }

  const { references, timescale } = parseSidx(
    data,
    sidxBox.offset,
    sidxBox.size,
  );

  return {
    initSegmentEnd: sidxBox.offset,
    segments: references,
    timescale,
    // TODO: parse codec from moov > trak > mdia > minf > stbl > stsd > esds
    codec: 'mp4a.40.2',
  };
}
