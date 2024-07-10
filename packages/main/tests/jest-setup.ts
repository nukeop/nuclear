import { 
  TextDecoder, 
  TextEncoder 
} from 'node:util';

import {
  ReadableStream,
  TransformStream
} from 'node:stream/web';


// ref: https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
// ref: https://github.com/jsdom/jsdom/issues/2524
// ref: https://github.com/mswjs/msw/discussions/1934
Object.defineProperties(global, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream }
});
