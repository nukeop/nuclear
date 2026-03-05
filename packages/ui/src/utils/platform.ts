export const isMac = (): boolean => {
  if (typeof navigator === 'undefined') {
    return false;
  }

  if ('userAgentData' in navigator) {
    return (
      (navigator as Navigator & { userAgentData: { platform: string } })
        .userAgentData.platform === 'macOS'
    );
  }

  return /Mac/.test(navigator.platform);
};
