import { QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Popover } from '@nuclearplayer/ui';

import { useCoreSetting } from '../hooks/useCoreSetting';
import { InfoField } from '../views/Settings/InfoField';

export const JamQrCodeButton: FC = () => {
  const { t } = useTranslation('remote');
  const [jamEnabled] = useCoreSetting<boolean>('integrations.jam.enabled');
  const [remoteUrl] = useCoreSetting<string>('integrations.jam.remoteUrl');

  if (!jamEnabled) {
    return null;
  }

  return (
    <Popover
      trigger={<QrCode size={20} />}
      anchor="bottom"
      className="relative"
      panelClassName="flex flex-col items-center gap-2 p-4"
    >
      <QRCodeSVG className="rounded-lg" value={remoteUrl ?? ''} size={200} />
      <InfoField label={t('qrCode.instructions')} value={remoteUrl} />
    </Popover>
  );
};
