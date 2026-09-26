import type { OperatingSystem } from '../../data/platforms';

const MOBILE_PATTERN = /Android|iPhone|iPad|iPod/;
const MAC_PATTERN = /Macintosh/;

const DESKTOP_PATTERNS: [RegExp, OperatingSystem][] = [
  [/Windows/, 'windows'],
  [MAC_PATTERN, 'macos'],
  [/Linux|X11/, 'linux'],
];

export const isMobileDevice = (userAgent: string, maxTouchPoints: number) =>
  MOBILE_PATTERN.test(userAgent) ||
  (MAC_PATTERN.test(userAgent) && maxTouchPoints > 1);

export const detectOperatingSystem = (
  userAgent: string,
  maxTouchPoints: number,
): OperatingSystem | undefined => {
  if (isMobileDevice(userAgent, maxTouchPoints)) {
    return undefined;
  }
  return DESKTOP_PATTERNS.find(([pattern]) => pattern.test(userAgent))?.[1];
};
