/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'stream-filter' {
  import { Transform } from 'stream';
  
  const filter: (cb: (item: any) => boolean) => Transform;

  export default filter;
}

declare module 'stream-reduce' {
  import { Transform } from 'stream';

  const reducer: (cb: (acc: any, item: any) => any, acc: any) => Transform;

  export default reducer;
}

declare module 'event-stream';
