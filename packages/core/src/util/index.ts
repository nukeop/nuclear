export function isValidPort(value): boolean {
  return typeof value === 'number' && value > 1024 && value < 49151;
}
