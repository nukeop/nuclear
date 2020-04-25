export function isElectron (): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof window !== 'undefined' && typeof window.process === 'object' && (window.process as any).type === 'renderer';
}

export function isValidPort(value): boolean {
  return typeof value === 'number' && value > 1024 && value < 49151;
}
