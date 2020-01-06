export function isElectron (): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof window !== 'undefined' && typeof window.process === 'object' && (window.process as any).type === 'renderer';
}
