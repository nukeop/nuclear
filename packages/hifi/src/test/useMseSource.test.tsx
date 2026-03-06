import { cleanup, render } from '@testing-library/react';

import { Sound } from '../Sound';
import { AudioSource } from '../types';
import { setupAudioContextMock } from './test-utils';

const mseSource: AudioSource = {
  url: 'http://127.0.0.1:9100/stream/encoded-fmp4-url',
  protocol: 'mse',
};

const httpSource: AudioSource = { url: '/a.mp3', protocol: 'http' };

type MockSourceBuffer = {
  appendBuffer: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
};

type MockMediaSource = {
  readyState: string;
  addSourceBuffer: ReturnType<typeof vi.fn>;
  endOfStream: ReturnType<typeof vi.fn>;
  addEventListener: (event: string, handler: () => void) => void;
};

const createMockMediaSource = () => {
  const sourceBuffer: MockSourceBuffer = {
    appendBuffer: vi.fn(),
    addEventListener: vi.fn().mockImplementation((_event, handler) => {
      queueMicrotask(handler);
    }),
  };

  let sourceopenHandler: (() => void) | null = null;

  const instance: MockMediaSource = {
    readyState: 'open',
    addSourceBuffer: vi.fn().mockReturnValue(sourceBuffer),
    endOfStream: vi.fn(),
    addEventListener: (event: string, handler: () => void) => {
      if (event === 'sourceopen') {
        sourceopenHandler = handler;
      }
    },
  };

  const triggerSourceOpen = () => sourceopenHandler?.();

  return { instance, sourceBuffer, triggerSourceOpen };
};

let mockMediaSource: ReturnType<typeof createMockMediaSource>;
const fakeObjectUrl = 'blob:mock-object-url';

describe('useMseSource', () => {
  let restoreAudioContext: () => void;

  beforeEach(() => {
    mockMediaSource = createMockMediaSource();

    vi.stubGlobal(
      'MediaSource',
      vi.fn(() => mockMediaSource.instance),
    );

    const chunk = new Uint8Array([1, 2, 3, 4]);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(chunk);
        controller.close();
      },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ body: stream }));

    URL.createObjectURL = vi.fn().mockReturnValue(fakeObjectUrl);
    URL.revokeObjectURL = vi.fn();

    const { restore } = setupAudioContextMock();
    restoreAudioContext = restore;
  });

  afterEach(() => {
    restoreAudioContext?.();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('creates a MediaSource and sets it as audio src for MSE sources', async () => {
    render(<Sound src={mseSource} status="playing" />);

    const audio = document.querySelector('audio') as HTMLAudioElement;
    mockMediaSource.triggerSourceOpen();
    await vi.waitFor(() => {
      expect(audio.src).toBe(fakeObjectUrl);
    });

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(mockMediaSource.instance.addSourceBuffer).toHaveBeenCalledWith(
      'audio/mp4; codecs="mp4a.40.2"',
    );
  });

  it('fetches the stream URL and appends the buffer', async () => {
    render(<Sound src={mseSource} status="playing" />);

    mockMediaSource.triggerSourceOpen();
    await vi.waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        mseSource.url,
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });

    await vi.waitFor(() => {
      expect(mockMediaSource.sourceBuffer.appendBuffer).toHaveBeenCalledWith(
        expect.any(Uint8Array),
      );
    });
  });

  it('calls endOfStream after the buffer is appended', async () => {
    render(<Sound src={mseSource} status="playing" />);

    mockMediaSource.triggerSourceOpen();
    await vi.waitFor(() => {
      expect(mockMediaSource.instance.endOfStream).toHaveBeenCalled();
    });
  });

  it('does not create a MediaSource for non-MSE sources', () => {
    render(<Sound src={httpSource} status="playing" />);

    expect(MediaSource).not.toHaveBeenCalled();
  });

  it('revokes the object URL on unmount', async () => {
    render(<Sound src={mseSource} status="playing" />);

    mockMediaSource.triggerSourceOpen();
    await vi.waitFor(() => {
      expect(audio().src).toBe(fakeObjectUrl);
    });

    cleanup();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(fakeObjectUrl);
  });
});

const audio = () => document.querySelector('audio') as HTMLAudioElement;
