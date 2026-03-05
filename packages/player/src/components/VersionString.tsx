import { FC } from 'react';

import { useAppVersion } from '../hooks/useAppVersion';

export const VersionString: FC = () => {
  const { version: appVersion, commitHash } = useAppVersion();

  if (!appVersion) {
    return null;
  }

  const versionString = `v${appVersion}${commitHash ? ` (${commitHash})` : ''}`;

  return (
    <span className="cursor-text text-xs select-all">{versionString}</span>
  );
};
