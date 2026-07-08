import { MockTimeRanges } from './mse-test-mocks';
import { StallDetector } from './StallDetector';

const STALL_WAIT_MS = 1000;

const createMockAudio = (currentTime: number, paused = false) => {
  return { currentTime, paused, playbackRate: 1 } as HTMLAudioElement;
};

const createDetectorWithClock = () => {
  let nowMs = 0;
  const detector = new StallDetector(() => nowMs);
  const advanceClock = (milliseconds: number) => {
    nowMs += milliseconds;
  };
  return { detector, advanceClock };
};

const midRangeBuffer = () => {
  const buffered = new MockTimeRanges();
  buffered.addRange(0, 40);
  return buffered as TimeRanges;
};

describe('StallDetector', () => {
  it('nudges currentTime forward when playback freezes mid-range for the stall threshold', () => {
    const { detector, advanceClock } = createDetectorWithClock();
    const audio = createMockAudio(9.98);
    const buffered = midRangeBuffer();

    detector.poll(audio, buffered);
    advanceClock(STALL_WAIT_MS);

    const acted = detector.poll(audio, buffered);

    expect(acted).toBe(true);
    expect(audio.currentTime).toBeCloseTo(10.08);
  });

  it('does not nudge while the audio element is paused', () => {
    const { detector, advanceClock } = createDetectorWithClock();
    const audio = createMockAudio(9.98, true);
    const buffered = midRangeBuffer();

    detector.poll(audio, buffered);
    advanceClock(STALL_WAIT_MS);

    const acted = detector.poll(audio, buffered);

    expect(acted).toBe(false);
    expect(audio.currentTime).toBe(9.98);
  });

  it('does not nudge while currentTime is progressing', () => {
    const { detector, advanceClock } = createDetectorWithClock();
    const audio = createMockAudio(5);
    const buffered = midRangeBuffer();

    detector.poll(audio, buffered);
    advanceClock(STALL_WAIT_MS);
    audio.currentTime = 6;

    const acted = detector.poll(audio, buffered);

    expect(acted).toBe(false);
    expect(audio.currentTime).toBe(6);
  });

  it('does not nudge near the tail of a buffered range, deferring to gap jumping', () => {
    const { detector, advanceClock } = createDetectorWithClock();
    const audio = createMockAudio(39.8);
    const buffered = midRangeBuffer();

    detector.poll(audio, buffered);
    advanceClock(STALL_WAIT_MS);

    const acted = detector.poll(audio, buffered);

    expect(acted).toBe(false);
    expect(audio.currentTime).toBe(39.8);
  });

  it('nudges only once per stall when the seek does not move currentTime', () => {
    const { detector, advanceClock } = createDetectorWithClock();
    const audio = createMockAudio(9.98);
    const buffered = midRangeBuffer();

    detector.poll(audio, buffered);
    advanceClock(STALL_WAIT_MS);
    detector.poll(audio, buffered);
    audio.currentTime = 9.98;
    advanceClock(STALL_WAIT_MS);

    const acted = detector.poll(audio, buffered);

    expect(acted).toBe(false);
    expect(audio.currentTime).toBe(9.98);
  });

  it('restarts the stall timer when resuming from pause at the same position', () => {
    const { detector, advanceClock } = createDetectorWithClock();
    const pausedAudio = createMockAudio(9.98, true);
    const playingAudio = createMockAudio(9.98);
    const buffered = midRangeBuffer();

    detector.poll(pausedAudio, buffered);
    advanceClock(STALL_WAIT_MS * 2);

    const actedImmediately = detector.poll(playingAudio, buffered);

    expect(actedImmediately).toBe(false);
    expect(playingAudio.currentTime).toBe(9.98);

    advanceClock(STALL_WAIT_MS);

    const actedAfterThreshold = detector.poll(playingAudio, buffered);

    expect(actedAfterThreshold).toBe(true);
    expect(playingAudio.currentTime).toBeCloseTo(10.08);
  });
});
