import { MSE_URL } from '../test/fixtures/fmp4Stream';
import { MockMediaSource, MockTimeRanges } from './mse-test-mocks';
import { MseController, MseInitOptions } from './MseController';

export {
  MockMediaSource,
  MockSourceBuffer,
  MockTimeRanges,
} from './mse-test-mocks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = window as any;

export class MseTestFixture {
  latestMediaSource: MockMediaSource | null = null;
  createObjectURLSpy!: ReturnType<
    typeof vi.fn<(obj: MediaSource | Blob) => string>
  >;
  revokeObjectURLSpy!: ReturnType<typeof vi.fn<(url: string) => void>>;
  audio!: HTMLAudioElement;

  private originalMediaSource: unknown;
  private originalManagedMediaSource: unknown;

  setup(): void {
    this.originalMediaSource = win.MediaSource;
    this.originalManagedMediaSource = win.ManagedMediaSource;

    const registerLatestMediaSource = (mediaSource: MockMediaSource) => {
      this.latestMediaSource = mediaSource;
    };
    const MockMSConstructor = vi.fn(function () {
      const mediaSource = new MockMediaSource();
      registerLatestMediaSource(mediaSource);
      return mediaSource;
    });
    win.MediaSource = MockMSConstructor;
    delete win.ManagedMediaSource;

    this.createObjectURLSpy = vi.fn(() => 'blob:mock-url');
    this.revokeObjectURLSpy = vi.fn();
    URL.createObjectURL = this.createObjectURLSpy;
    URL.revokeObjectURL = this.revokeObjectURLSpy;

    this.audio = document.createElement('audio');
    document.body.appendChild(this.audio);
  }

  teardown(): void {
    if (this.originalMediaSource !== undefined) {
      win.MediaSource = this.originalMediaSource;
    } else {
      delete win.MediaSource;
    }

    if (this.originalManagedMediaSource !== undefined) {
      win.ManagedMediaSource = this.originalManagedMediaSource;
    } else {
      delete win.ManagedMediaSource;
    }

    this.latestMediaSource = null;
    vi.restoreAllMocks();

    if (this.audio && this.audio.parentNode) {
      this.audio.parentNode.removeChild(this.audio);
    }
  }

  setCurrentTime(value: number): void {
    Object.defineProperty(this.audio, 'currentTime', {
      value,
      writable: true,
      configurable: true,
    });
  }

  async initControllerAtLowBuffer(
    controller: MseController,
    options: MseInitOptions = {},
  ): Promise<MockMediaSource> {
    const mediaSource = await this.initController(controller, options);

    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.buffered = new MockTimeRanges();
    sourceBuffer.buffered.addRange(0, 60);
    this.setCurrentTime(50);

    return mediaSource;
  }

  async initController(
    controller: MseController,
    options: MseInitOptions = {},
  ): Promise<MockMediaSource> {
    const initPromise = controller.init(this.audio, MSE_URL, options);

    await vi.waitFor(() => expect(this.latestMediaSource).not.toBeNull());
    this.latestMediaSource!.open();

    await initPromise;
    return this.latestMediaSource!;
  }
}
