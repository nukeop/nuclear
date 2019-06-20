import i18n from 'i18next';
import { remote } from 'electron';

import { getOption, setOption } from './persistence/store';

import en from './locales/en.json';
import fr from './locales/fr.json';
import nl from './locales/nl.json';
import zh from './locales/zh.json';
import de from './locales/de.json';
import dk from './locales/dk.json';
import es from './locales/es.json';
import pl from './locales/pl.json';

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
      fr,
      nl,
      zh,
      de,
      dk,
      es,
      pl,
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
