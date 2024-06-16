import { TextDecoder, TextEncoder } from 'node:util';
import { Readable } from 'stream';

// ref: https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
// ref: https://github.com/jsdom/jsdom/issues/2524
// ref: https://github.com/mswjs/msw/discussions/1934
Object.defineProperties(globalThis, {
  TextDecoder: { writable: true, value: TextDecoder },
  TextEncoder: { writable: true, value: TextEncoder },
  ReadableStream: { writable: true, value: Readable },
  require: { writable: true, value: require }
});
