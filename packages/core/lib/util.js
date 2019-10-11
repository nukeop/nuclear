export function isElectron () {
  return typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer';
}
