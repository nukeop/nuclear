import { paddedBox, SidxBoxBuilder } from './boxes';

const FTYP_SIZE = 20;
const MOOV_SIZE = 100;
const SEGMENT_FILL_BYTE = 0xab;

type TrackSegment = {
  sizeBytes: number;
  durationSeconds: number;
};

export type SegmentByteRange = {
  startByte: number;
  endByte: number;
};

export class Fmp4Track {
  readonly initSegmentEnd: number;

  private readonly headerBytes: Uint8Array;

  constructor(
    timescale: number,
    private readonly segments: TrackSegment[],
  ) {
    const ftyp = paddedBox('ftyp', FTYP_SIZE);
    const moov = paddedBox('moov', MOOV_SIZE);
    const sidx = segments
      .reduce(
        (builder, segment) =>
          builder.withReference(
            segment.sizeBytes,
            segment.durationSeconds * timescale,
          ),
        new SidxBoxBuilder().withTimescale(timescale),
      )
      .build();

    this.initSegmentEnd = ftyp.length + moov.length;
    this.headerBytes = new Uint8Array([...ftyp, ...moov, ...sidx]);
  }

  segmentSize(segmentIndex: number): number {
    return this.segments[segmentIndex].sizeBytes;
  }

  byteRangeForSegment(segmentIndex: number): SegmentByteRange {
    const precedingBytes = this.segments
      .slice(0, segmentIndex)
      .reduce((total, segment) => total + segment.sizeBytes, 0);
    const startByte = this.headerBytes.length + precedingBytes;
    const endByte = startByte + this.segments[segmentIndex].sizeBytes - 1;
    return { startByte, endByte };
  }

  headerResponse(size: number): Uint8Array {
    const response = new Uint8Array(size);
    response.set(this.headerBytes.subarray(0, size), 0);
    return response;
  }

  bytesForRange(startByte: number, endByte: number): Uint8Array {
    const size = endByte - startByte + 1;
    if (startByte === 0) {
      return this.headerResponse(size);
    }
    return new Uint8Array(size).fill(SEGMENT_FILL_BYTE);
  }
}

export class Fmp4TrackBuilder {
  private timescale = 44100;
  private segments: TrackSegment[] = [];

  withTimescale(timescale: number): this {
    this.timescale = timescale;
    return this;
  }

  withSegment(sizeBytes: number, durationSeconds: number): this {
    this.segments.push({ sizeBytes, durationSeconds });
    return this;
  }

  build(): Fmp4Track {
    return new Fmp4Track(this.timescale, [...this.segments]);
  }
}
