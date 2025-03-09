import { 
  TextDecoder, 
  TextEncoder 
} from 'node:util';

import {
  ReadableStream,
  TransformStream
} from 'node:stream/web';

import {Blob} from 'buffer';

// ref: https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
// ref: https://github.com/jsdom/jsdom/issues/2524
// ref: https://github.com/mswjs/msw/discussions/1934
Object.defineProperties(global, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
  Blob: { value: Blob },
  MessagePort: { value: {} },
  DOMException: { value: Error }
});

Object.defineProperty(global, 'require', {
  writable: true,
  value: require
});
