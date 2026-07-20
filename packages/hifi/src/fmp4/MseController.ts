import { LoggerProvider } from '../LoggerProvider';
import { SoundError } from '../SoundError';
import { MediaSourceAttachment } from './MediaSourceAttachment';
import { MseSession } from './MseSession';
import { openMseSession, StreamInvalidError } from './openMseSession';

export type MseInitOptions = {
  codec?: string;
  onError?: (error: SoundError) => void;
  onSourceInvalid?: () => void;
};

export class MseController {
  private session: MseSession | null = null;
  private abortController: AbortController | null = null;
  private attachment: MediaSourceAttachment | null = null;

  async init(
    audio: HTMLAudioElement,
    url: string,
    options: MseInitOptions = {},
  ): Promise<void> {
    this.destroy(audio);

    const abortController = new AbortController();
    this.abortController = abortController;
    const attachment = new MediaSourceAttachment();
    this.attachment = attachment;

    try {
      const session = await openMseSession(
        audio,
        url,
        attachment,
        abortController.signal,
        { codec: options.codec, onSourceInvalid: options.onSourceInvalid },
      );
      if (!session) {
        return;
      }

      this.session = session;
      await session.start(audio);
    } catch (error) {
      this.handleSetupFailure(error, options);
    }
  }

  handleTimeUpdate(audio: HTMLAudioElement): void {
    this.session?.onTimeUpdate(audio);
  }

  async handleSeeking(audio: HTMLAudioElement): Promise<void> {
    await this.session?.onSeeking(audio);
  }

  handleStall(audio: HTMLAudioElement): void {
    this.session?.onStall(audio);
  }

  destroy(audio: HTMLAudioElement | null): void {
    this.session?.dispose();
    this.session = null;

    this.abortController?.abort();
    this.abortController = null;

    this.attachment?.detach(audio);
    this.attachment = null;
  }

  private handleSetupFailure(error: unknown, options: MseInitOptions): void {
    if (error instanceof StreamInvalidError) {
      void LoggerProvider.get().warn(`[MSE] ${error.message}`);
      options.onSourceInvalid?.();
      return;
    }
    if (error instanceof SoundError) {
      options.onError?.(error);
      return;
    }
    throw error;
  }
}
