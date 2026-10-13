import { useEffect } from 'react';

import { i18n } from '@nuclearplayer/i18n';

import { useRemoteStore } from './remoteStore';

export const useRemoteLanguage = () => {
  const language = useRemoteStore((state) => state.settings.language);

  useEffect(() => {
    void i18n.changeLanguage(language);
  }, [language]);
};
