import '@testing-library/jest-dom';
global.setImmediate = jest.useRealTimers as unknown as typeof setImmediate;
import { Readable } from 'stream';

// ref: https://github.com/mswjs/msw/discussions/1934
Object.defineProperties(globalThis, {
  ReadableStream: { writable: true, value: Readable }
});
