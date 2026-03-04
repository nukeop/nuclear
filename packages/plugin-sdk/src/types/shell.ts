export type ShellHost = {
  openExternal(url: string): Promise<void>;
};
