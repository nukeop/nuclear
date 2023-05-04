declare module '*.scss' {
  const content: {[className: string]: string};
  export default content;
}

declare module '*.png' {
  export = module as string;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  > & { title?: string }>;

  const src: string;
  export default src;
}
