import { SegmentReference } from './parser';

export class SegmentTimeline {
  private fetched = new Set<number>();

  constructor(
    private readonly segments: SegmentReference[],
    private readonly bufferedEndToleranceSeconds = 0.01,
  ) {}

  get isEmpty(): boolean {
    return this.segments.length === 0;
  }

  get length(): number {
    return this.segments.length;
  }

  get durationSeconds(): number {
    if (this.isEmpty) {
      return 0;
    }
    return this.segments[this.segments.length - 1].endTime;
  }

  contains(segmentIndex: number): boolean {
    return segmentIndex >= 0 && segmentIndex < this.segments.length;
  }

  get(segmentIndex: number): SegmentReference {
    return this.segments[segmentIndex];
  }

  isFinal(segmentIndex: number): boolean {
    return segmentIndex === this.segments.length - 1;
  }

  segmentIndexForTime(time: number): number {
    return this.segments.findIndex(
      (segment) => time >= segment.startTime && time < segment.endTime,
    );
  }

  nextUnfetchedIndex(bufferedEnd: number): number {
    const threshold = bufferedEnd + this.bufferedEndToleranceSeconds;
    return this.segments.findIndex(
      (segment, index) =>
        !this.fetched.has(index) && segment.endTime > threshold,
    );
  }

  isFetched(segmentIndex: number): boolean {
    return this.fetched.has(segmentIndex);
  }

  markFetched(segmentIndex: number): void {
    this.fetched.add(segmentIndex);
  }

  unmarkFetched(segmentIndex: number): void {
    this.fetched.delete(segmentIndex);
  }

  clearFetched(): void {
    this.fetched.clear();
  }
}
