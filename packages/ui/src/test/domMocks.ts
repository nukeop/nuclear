type ResizeObserverLike = new (callback: ResizeObserverCallback) => {
  observe(target: Element, options?: ResizeObserverOptions): void;
  unobserve(target: Element): void;
  disconnect(): void;
};

const parseSize = (value: string | null): number | null => {
  if (value === null) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const buildEntry = (target: Element, inlineSize: number, blockSize: number) => {
  const size = {
    inlineSize,
    blockSize,
  } as ResizeObserverSize;
  const contentRect = {
    width: inlineSize,
    height: blockSize,
    top: 0,
    left: 0,
    bottom: blockSize,
    right: inlineSize,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRectReadOnly;
  return {
    target,
    borderBoxSize: [size],
    contentBoxSize: [size],
    contentRect,
    devicePixelContentBoxSize: [size],
  } as ResizeObserverEntry;
};

const setupMatchMediaMock = () => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

const setupResizeObserverMock = () => {
  class ResizeObserverMock {
    private callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }
    observe(target: Element, options?: ResizeObserverOptions): void {
      void options;
      const inlineAttr = parseSize(
        target.getAttribute('data-test-resize-observer-inline-size'),
      );
      const blockAttr = parseSize(
        target.getAttribute('data-test-resize-observer-block-size'),
      );
      if (inlineAttr === null && blockAttr === null) {
        return;
      }
      const inlineSize = inlineAttr ?? blockAttr ?? 0;
      const blockSize = blockAttr ?? inlineAttr ?? 0;
      const entry = buildEntry(target, inlineSize, blockSize);
      this.callback([entry], this);
    }
    unobserve(target: Element): void {
      void target;
    }
    disconnect(): void {}
  }

  (globalThis as { ResizeObserver?: ResizeObserverLike }).ResizeObserver =
    ResizeObserverMock;
};

export const setupDomMocks = () => {
  setupMatchMediaMock();
  setupResizeObserverMock();

  Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  globalThis.CSS = { supports: () => true } as unknown as typeof CSS;
  (SVGElement.prototype as SVGGraphicsElement).getBBox = vi
    .fn()
    .mockReturnValue({ x: 0, y: 0, width: 0, height: 0 });
};
