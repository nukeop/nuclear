import { i18n } from '@nuclearplayer/i18n';

import { coreSettingsHost } from './settingsHost';

const RTL_LOCALES = new Set(['he_IL']);

const applyDocumentDirection = (locale: string) => {
  document.documentElement.dir = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
  document.documentElement.lang = locale.replace('_', '-');
};

export const changeLanguage = async (locale: string) => {
  await i18n.changeLanguage(locale);
  applyDocumentDirection(locale);
};

export const applyLanguageFromSettings = async () => {
  const savedLanguage = await coreSettingsHost.get<string>('general.language');
  if (savedLanguage && typeof savedLanguage === 'string') {
    await changeLanguage(savedLanguage);
  }
};

export const initLanguageWatcher = () => {
  coreSettingsHost.subscribe('general.language', (value) => {
    if (value && typeof value === 'string') {
      void changeLanguage(value);
    }
  });
};
