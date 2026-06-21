import { createContext, FC, ReactNode, useContext } from 'react';

export type Platform = 'macos' | 'windows' | 'linux';

const PlatformContext = createContext<Platform>('linux');

type PlatformProviderProps = {
  platform?: Platform;
  children: ReactNode;
};

export const PlatformProvider: FC<PlatformProviderProps> = ({
  platform = 'linux',
  children,
}) => (
  <PlatformContext.Provider value={platform}>
    {children}
  </PlatformContext.Provider>
);

export const usePlatform = (): Platform => useContext(PlatformContext);
