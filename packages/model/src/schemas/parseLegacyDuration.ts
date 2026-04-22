const DURATION_RE = /^(?:(\d+):)?(\d+):(\d\d)$|^(\d+(?:\.\d+)?)$/;

// Supports formats used by old Nuclear.
// Examples: 3:15, 03:15, 1:02:03
export const parseLegacyDuration = (value: string): number => {
  const match = DURATION_RE.exec(value);
  if (!match) {
    return NaN;
  }
  const [, hh, mm, ss, plain] = match;
  if (plain !== undefined) {
    return Number(plain);
  }
  if (Number(mm) >= 60 || Number(ss) >= 60) {
    return NaN;
  }
  return (Number(hh) || 0) * 3600 + Number(mm) * 60 + Number(ss);
};
