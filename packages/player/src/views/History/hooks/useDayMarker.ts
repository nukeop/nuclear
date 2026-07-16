import { DateTime } from 'luxon';

import { useTranslation } from '@nuclearplayer/i18n';

export const useDayMarker = () => {
  const { t } = useTranslation('history');

  return (day: DateTime): string => {
    const today = DateTime.now().startOf('day');
    if (day.hasSame(today, 'day')) {
      return t('today');
    }
    if (day.hasSame(today.minus({ days: 1 }), 'day')) {
      return t('yesterday');
    }
    return day.toLocaleString(DateTime.DATE_FULL);
  };
};
