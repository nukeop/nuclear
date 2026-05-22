import '@testing-library/jest-dom';

Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: vi.fn().mockImplementation(function (this: HTMLMediaElement) {
    Object.defineProperty(this, 'paused', { value: false, configurable: true });
    return Promise.resolve();
  }),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: vi.fn().mockImplementation(function (this: HTMLMediaElement) {
    Object.defineProperty(this, 'paused', { value: true, configurable: true });
  }),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: vi.fn().mockImplementation(function (this: HTMLMediaElement) {
    Object.defineProperty(this, 'readyState', {
      value: 0,
      configurable: true,
    });
    Object.defineProperty(this, 'paused', {
      value: true,
      configurable: true,
    });
  }),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'currentTime', {
  writable: true,
  value: 0,
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'duration', {
  writable: true,
  value: 100,
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'readyState', {
  writable: true,
  configurable: true,
  value: 0,
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'paused', {
  writable: true,
  configurable: true,
  value: true,
});
