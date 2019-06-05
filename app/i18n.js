import i18n from 'i18next';
import { remote } from 'electron';

import { getOption, setOption } from './persistence/store';

import en from './locales/en.json';
import fr from './locales/fr.json';

const languageDetector = {
  init: Function.prototype,
  type: 'languageDetector',
  detect: () => getOption('language') || remote.app.getLocale(),
  cacheUserLanguage: Function.prototype
};

export const setupI18n = () => {
  return i18n.use(languageDetector).init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production',
    resources: {
      en,
      fr
    },
    interpolation: {
      escapeValue: false
    },
    react: {
      wait: true
    }
  });
};

i18n.on('languageChanged', lng => setOption('language', lng));

export default i18n;
