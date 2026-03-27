import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de_DE from './locales/de_DE.json';
import en_US from './locales/en_US.json';
import es_ES from './locales/es_ES.json';
import fr_FR from './locales/fr_FR.json';
import he_IL from './locales/he_IL.json';
import it_IT from './locales/it_IT.json';
import pt_BR from './locales/pt_BR.json';
import ru_RU from './locales/ru_RU.json';

export const resources = {
  en_US,
  de_DE,
  es_ES,
  fr_FR,
  he_IL,
  it_IT,
  pt_BR,
  ru_RU,
} as const;

i18n.use(initReactI18next).init({
  showSupportNotice: false, // disables console.log advertisement spam
  resources,
  lng: 'en_US',
  fallbackLng: 'en_US',
  defaultNS: 'common',
  ns: [
    'common',
    'navigation',
    'search',
    'artist',
    'themes',
    'settings',
    'dashboard',
    'plugins',
    'streaming',
  ],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: true,
  },
});

export default i18n;
