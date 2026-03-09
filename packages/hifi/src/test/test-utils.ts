type GainSpyNode = {
  connect: () => unknown;
  disconnect: () => void;
  gain: {
    setValueAtTime: ReturnType<typeof vi.fn>;
    linearRampToValueAtTime: ReturnType<typeof vi.fn>;
  };
};

export const setupAudioContextMock = () => {
  const origAudioContext = window.AudioContext;
  const gains: GainSpyNode[] = [];
  const fakeDestination = {
    connect: vi.fn(),
    disconnect: vi.fn(),
  } as unknown as AudioDestinationNode;
  const fakeCtx = {
    currentTime: 0,
    resume: vi.fn(),
    close: vi.fn(),
    createMediaElementSource: () => ({
      connect: vi.fn(),
      disconnect: vi.fn(),
    }),
    createGain: () => {
      const node: GainSpyNode = {
        connect: () => fakeCtx,
        disconnect: vi.fn(),
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
        },
      };
      gains.push(node);
      return node as unknown as GainNode;
    },
    destination: fakeDestination,
  } as unknown as AudioContext;
  window.AudioContext = vi.fn(() => fakeCtx) as unknown as typeof AudioContext;
  const restore = () => {
    window.AudioContext = origAudioContext;
  };
  return { gains, restore };
};

export const resetMediaSpies = (): {
  playMock: ReturnType<typeof vi.fn>;
  pauseMock: ReturnType<typeof vi.fn>;
} => {
  const playMock = window.HTMLMediaElement.prototype
    .play as unknown as ReturnType<typeof vi.fn>;
  const pauseMock = window.HTMLMediaElement.prototype
    .pause as unknown as ReturnType<typeof vi.fn>;
  playMock.mockClear();
  pauseMock.mockClear();
  return { playMock, pauseMock };
};
