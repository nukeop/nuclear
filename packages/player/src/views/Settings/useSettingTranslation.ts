import { useTranslation } from 'react-i18next';

import type { SettingDefinition } from '@nuclearplayer/plugin-sdk';

export const useSettingTranslation = (definition: SettingDefinition) => {
  const { t } = useTranslation('preferences', { useSuspense: false });

  const translateField = (field: string | undefined): string | undefined => {
    if (!field) {
      return undefined;
    }

    if (!field.startsWith('preferences.')) {
      return field;
    }

    const key = field.replace('preferences.', '');
    const translated = t(key, { defaultValue: field });

    return translated === field ? field : translated;
  };

  return {
    title: translateField(definition.title) ?? definition.title,
    description: translateField(definition.description),
  };
};
