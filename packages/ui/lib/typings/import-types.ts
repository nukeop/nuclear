declare module '*.scss' {
  const content: {[className: string]: string};
  export default content;
}

declare module '*.png' {
  export = module;
}
