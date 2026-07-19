import { getMseBackend } from './MseBackend';

export const waitForSourceOpen = (mediaSource: MediaSource): Promise<void> =>
  new Promise((resolve) => {
    const onSourceOpen = () => {
      mediaSource.removeEventListener('sourceopen', onSourceOpen);
      resolve();
    };
    mediaSource.addEventListener('sourceopen', onSourceOpen);
  });

export class MediaSourceAttachment {
  private mediaSource: MediaSource | null = null;
  private objectUrl: string | null = null;

  attach(audio: HTMLAudioElement): MediaSource | null {
    const backend = getMseBackend();
    if (!backend) {
      return null;
    }

    const mediaSource = new backend.Constructor();
    this.mediaSource = mediaSource;

    if (backend.managed) {
      audio.disableRemotePlayback = true;
      audio.srcObject = mediaSource;
    } else {
      this.objectUrl = URL.createObjectURL(mediaSource);
      audio.src = this.objectUrl;
    }

    return mediaSource;
  }

  endStream(): void {
    const { mediaSource } = this;
    if (!mediaSource || mediaSource.readyState !== 'open') {
      return;
    }

    try {
      mediaSource.endOfStream();
    } catch {
      // MediaSource may already be closing
    }
  }

  detach(audio: HTMLAudioElement | null): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }

    if (audio && audio.srcObject) {
      audio.srcObject = null;
    }

    this.endStream();
    this.mediaSource = null;
  }
}
