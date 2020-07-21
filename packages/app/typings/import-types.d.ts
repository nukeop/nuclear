declare module '*.scss' {
  const content: {[className: string]: string};
  export default content;
}

declare module '*.png' {
  const src: string;
  export default src;
}
