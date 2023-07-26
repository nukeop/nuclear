import i18n, { LanguageDetectorModule } from 'i18next';

import ar_SA from './locales/ar_SA.json';
import be_BY from './locales/be_BY.json';
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
import ku_KMR from './locales/ku_KMR.json';
import lt_LT from './locales/lt_LT.json';
import lv_LV from './locales/lv_LV.json';
import nl from './locales/nl.json';
import no_NO from './locales/no_NO.json';
import pl from './locales/pl.json';
import pt_BR from './locales/pt_BR.json';
import ro_RO from './locales/ro_RO.json';
import ru from './locales/ru.json';
import se from './locales/se.json';
import sk from './locales/sk.json';
import sq from './locales/sq.json';
import tl from './locales/tl.json';
import tr from './locales/tr.json';
import uk_UA from './locales/uk_UA.json';
import vi from './locales/vi.json';
import yue_CN from './locales/yue_CN.json';
import zh_CN from './locales/zh_CN.json';
import zh_TW from './locales/zh_TW.json';

interface I18nOptions {
  languageDetector: LanguageDetectorModule;
  debug?: boolean;
}

export const setupI18n = ({ languageDetector, debug }: I18nOptions) => {
  return i18n.use(languageDetector).init({
    fallbackLng: 'en',
    debug,
    resources: {
      ar_SA,
      be_BY,
      bn_BD,
      cs,
      de,
      dk,
      en,
      es,
      fi,
      fr,
      gr,
      he_IL,
      hi_IN,
      hr,
      id,
      is,
      it,
      ja_JP,
      ko,
      ku_KMR,
      lt_LT,
      lv_LV,
      nl,
      no_NO,
      pl,
      pt_BR,
      ro_RO,
      ru,
      se,
      sk,
      sq,
      tl,
      tr,
      uk_UA,
      vi,
      yue_CN,
      zh_TW,
      zh_CN
    },
    interpolation: {
      escapeValue: false
    }
  });
};

export default i18n;
