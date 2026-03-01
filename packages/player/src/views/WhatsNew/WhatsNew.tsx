import { useTranslation } from '@nuclearplayer/i18n';
import { ViewShell } from '@nuclearplayer/ui';

export const WhatsNew = () => {
  const { t } = useTranslation('changelog');

  return (
    <ViewShell title={t('title')}>
      <div />
    </ViewShell>
  );
};
