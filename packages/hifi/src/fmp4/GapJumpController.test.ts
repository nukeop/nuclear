import { GapJumpController } from './GapJumpController';
import { MockTimeRanges } from './mse-test-mocks';

const POLL_INTERVAL_MS = 250;

function createMockAudio(currentTime: number, paused: boolean) {
  return { currentTime, paused, playbackRate: 1 } as HTMLAudioElement;
}

describe('GapJumpController', () => {
  describe('jumpGap', () => {
    it('jumps across a micro-gap between buffered ranges when playing', () => {
      const controller = new GapJumpController();
      const buffered = new MockTimeRanges();
      buffered.addRange(0, 9.98);
      buffered.addRange(10.02, 60);

      const audio = createMockAudio(9.98, false);

      controller.jumpGap(audio, buffered as TimeRanges);

      expect(audio.currentTime).toBe(10.02);
    });

    it('does not jump across a gap when the audio element is paused', () => {
      const controller = new GapJumpController();
      const buffered = new MockTimeRanges();
      buffered.addRange(0, 9.98);
      buffered.addRange(10.02, 60);

      const audio = createMockAudio(9.98, true);

      controller.jumpGap(audio, buffered as TimeRanges);

      expect(audio.currentTime).toBe(9.98);
    });

    it('does not jump when currentTime is far from the tail of the previous range', () => {
      const controller = new GapJumpController();
      const buffered = new MockTimeRanges();
      buffered.addRange(0, 9.0);
      buffered.addRange(12.0, 60);

      const audio = createMockAudio(3.0, false);

      controller.jumpGap(audio, buffered as TimeRanges);

      expect(audio.currentTime).toBe(3.0);
    });

    it('ignores sub-millisecond gaps the browser plays through on its own', () => {
      const controller = new GapJumpController();
      const buffered = new MockTimeRanges();
      buffered.addRange(0, 10.0);
      buffered.addRange(10.0005, 60);

      const audio = createMockAudio(9.9999, false);

      controller.jumpGap(audio, buffered as TimeRanges);

      expect(audio.currentTime).toBe(9.9999);
    });
  });

  describe('poll', () => {
    it('nudges a playhead frozen inside a single merged buffered range', async () => {
      const controller = new GapJumpController();
      const buffered = new MockTimeRanges();
      buffered.addRange(0, 60);

      const sourceBuffer = { buffered } as unknown as SourceBuffer;
      const audio = createMockAudio(9.98, false);

      vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] });
      try {
        controller.start(audio, sourceBuffer);

        await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS);
        expect(audio.currentTime).toBe(9.98);

        await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS * 4);
        expect(audio.currentTime).toBeCloseTo(10.08);
      } finally {
        vi.useRealTimers();
        controller.stop();
      }
    });
  });

  describe('start/stop', () => {
    it('polls for gaps on the configured interval, and stop halts the polling', async () => {
      const controller = new GapJumpController();
      const buffered = new MockTimeRanges();
      buffered.addRange(0, 9.98);
      buffered.addRange(10.02, 60);

      const sourceBuffer = { buffered } as unknown as SourceBuffer;
      const audio = createMockAudio(9.98, false);

      vi.useFakeTimers();
      try {
        controller.start(audio, sourceBuffer);

        await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS);

        expect(audio.currentTime).toBe(10.02);

        controller.stop();
        audio.currentTime = 9.98;

        await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS);

        expect(audio.currentTime).toBe(9.98);
      } finally {
        vi.useRealTimers();
      }
    });
  });
});
