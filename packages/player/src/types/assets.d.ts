declare module '*.wasm?url' {
  const url: string;
  export default url;
}

declare module '*.css?raw' {
  const content: string;
  export default content;
}
