import i18n, { LanguageDetectorModule } from 'i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';
import nl from './locales/nl.json';
import zh from './locales/zh.json';
import de from './locales/de.json';
import dk from './locales/dk.json';
import es from './locales/es.json';
import ru from './locales/ru.json';
import pl from './locales/pl.json';
import pt_br from './locales/pt_br.json';
import tr from './locales/tr.json';
import it from './locales/it.json';
import id from './locales/id.json';
import sk from './locales/sk.json';
import cs from './locales/cs.json';
import ko from './locales/ko.json';
import tl from './locales/tl.json';
import zh_tw from './locales/zh_tw.json';
import se from './locales/se.json';
import gr from './locales/gr.json';
import hr from './locales/hr.json';
import is from './locales/is.json';
import vi from './locales/vi.json';
import fi from './locales/fi.json';

interface I18nOptions {
  languageDetector: LanguageDetectorModule;
  debug?: boolean;
  react?: boolean;
}

export const setupI18n = ({ languageDetector, debug, react }: I18nOptions) => {
  return i18n.use(languageDetector).init({
    fallbackLng: 'en',
    debug,
    resources: {
      en,
      fr,
      nl,
      zh,
      de,
      dk,
      es,
      ru,
      pl,
      pt_br,
      tr,
      it,
      id,
      sk,
      cs,
      ko,
      tl,
      zh_tw,
      se,
      gr,
      hr,
      is,
      vi,
      fi
    },
    interpolation: {
      escapeValue: false
    },
    react: {
      wait: react
    }
  });
};

export default i18n;
