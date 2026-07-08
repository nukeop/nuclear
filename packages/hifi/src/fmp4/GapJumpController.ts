const GAP_DETECTION_THRESHOLD_SECONDS = 0.5;
const BROWSER_GAP_TOLERANCE_SECONDS = 0.001;
const GAP_JUMP_POLL_INTERVAL_MS = 250;

export class GapJumpController {
  private intervalId: ReturnType<typeof setInterval> | null = null;

  start(
    audio: HTMLAudioElement,
    sourceBuffer: SourceBuffer,
    onPollTick?: () => void,
  ): void {
    this.stop();
    this.intervalId = setInterval(() => {
      this.jumpGap(audio, sourceBuffer.buffered);
      onPollTick?.();
    }, GAP_JUMP_POLL_INTERVAL_MS);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  jumpGap(audio: HTMLAudioElement, buffered: TimeRanges): void {
    if (audio.paused || buffered.length < 2) {
      return;
    }

    const { currentTime } = audio;

    for (let rangeIndex = 1; rangeIndex < buffered.length; rangeIndex++) {
      const rangeStart = buffered.start(rangeIndex);
      if (currentTime >= rangeStart) {
        continue;
      }

      const previousRangeEnd = buffered.end(rangeIndex - 1);
      if (previousRangeEnd - currentTime > GAP_DETECTION_THRESHOLD_SECONDS) {
        continue;
      }

      if (rangeStart - currentTime < BROWSER_GAP_TOLERANCE_SECONDS) {
        return;
      }

      audio.currentTime = rangeStart;
      return;
    }
  }
}
