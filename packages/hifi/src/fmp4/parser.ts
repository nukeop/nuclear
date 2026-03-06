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

function readUint32(data: Uint8Array, offset: number): number {
  return (
    ((data[offset] << 24) |
      (data[offset + 1] << 16) |
      (data[offset + 2] << 8) |
      data[offset + 3]) >>>
    0
  );
}

function readUint64(data: Uint8Array, offset: number): number {
  const high = readUint32(data, offset);
  const low = readUint32(data, offset + 4);
  return high * 0x100000000 + low;
}

function readAscii(data: Uint8Array, offset: number, length: number): string {
  return String.fromCharCode(...data.slice(offset, offset + length));
}

function readUint16(data: Uint8Array, offset: number): number {
  return ((data[offset] << 8) | data[offset + 1]) >>> 0;
}

export function findBoxes(data: Uint8Array): Fmp4Box[] {
  const boxes: Fmp4Box[] = [];
  let offset = 0;

  while (offset < data.length) {
    if (offset + BOX_HEADER_SIZE > data.length) {
      break;
    }

    let size = readUint32(data, offset);
    const type = readAscii(data, offset + 4, 4);

    if (size === EXTENDED_SIZE_MARKER) {
      size = readUint64(data, offset + BOX_HEADER_SIZE);
    } else if (size === 0) {
      size = data.length - offset;
    }

    boxes.push({ type, offset, size });
    offset += size;
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
  let cursor = boxOffset + BOX_HEADER_SIZE;

  const version = data[cursor]; // version (1 byte) + flags (3 bytes)
  cursor += 4;

  cursor += 4; // reference_ID
  const timescale = readUint32(data, cursor);
  cursor += 4;

  // earliest_presentation_time + first_offset
  // 32-bit each in v0, 64-bit each in v1
  let firstOffset: number;
  if (version === 0) {
    cursor += 4; // earliest_presentation_time (32-bit)
    firstOffset = readUint32(data, cursor);
    cursor += 4;
  } else {
    cursor += 8; // earliest_presentation_time (64-bit)
    firstOffset = readUint64(data, cursor);
    cursor += 8;
  }

  cursor += 2; // reserved
  const referenceCount = readUint16(data, cursor);
  cursor += 2;

  let byteOffset = boxOffset + boxSize + firstOffset;
  let timeOffset = 0;
  const references: SegmentReference[] = [];

  for (let index = 0; index < referenceCount; index++) {
    // Bit 0 is reference_type (0 = media, 1 = index); mask it off
    const referencedSize = readUint32(data, cursor) & 0x7fffffff;
    cursor += 4;
    const subsegmentDuration = readUint32(data, cursor);
    cursor += 4;
    cursor += 4; // starts_with_SAP + SAP_type + SAP_delta_time

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
