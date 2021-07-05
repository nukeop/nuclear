import i18n, { LanguageDetectorModule } from 'i18next';

import af_ZA from './locales/af_ZA.json';
import ar_SA from './locales/ar_SA.json';
import bn_BD from './locales/bn_BD.json';
import cs from './locales/cs.json';
import de from './locales/de.json';
import dk from './locales/dk.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fi from './locales/fi.json';
import fr from './locales/fr.json';
import gr from './locales/gr.json';
import he_IL from './locales/he_IL.json';
import hi_IN from './locales/hi_IN.json';
import hr from './locales/hr.json';
import id from './locales/id.json';
import is from './locales/is.json';
import it from './locales/it.json';
import ja_JP from './locales/ja_JP.json';
import ko from './locales/ko.json';
import nl from './locales/nl.json';
import no_NO from './locales/no_NO.json';
import pa_IN from './locales/pa_IN.json';
import pl from './locales/pl.json';
import pt_br from './locales/pt_br.json';
import ro_RO from './locales/ro_RO.json';
import ru from './locales/ru.json';
import se from './locales/se.json';
import sk from './locales/sk.json';
import sq from './locales/sq.json';
import te_IN from './locales/te_IN.json';
import tl from './locales/tl.json';
import tr from './locales/tr.json';
import vi from './locales/vi.json';
import zh from './locales/zh.json';
import zh_tw from './locales/zh_tw.json';

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
      fi,
      af_ZA,
      ar_SA,
      bn_BD,
      he_IL,
      hi_IN,
      ja_JP,
      no_NO,
      pa_IN,
      ro_RO,
      sq,
      te_IN
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
