import { useTranslation } from '@nuclearplayer/i18n';
import { Select } from '@nuclearplayer/ui';

import { useAudioOutputStore } from '../../stores/audioOutputStore';

const DEFAULT_DEVICE_ID = 'default';

export const AudioOutputSection = () => {
  const { t } = useTranslation('preferences');
  const devices = useAudioOutputStore((s) => s.devices);
  const selectedSinkId = useAudioOutputStore((s) => s.selectedSinkId);
  const selectDevice = useAudioOutputStore((s) => s.selectDevice);
  const isSupported = useAudioOutputStore((s) => s.isSupported);

  if (!isSupported) {
    return null;
  }

  const options = [
    { id: DEFAULT_DEVICE_ID, label: t('audioOutput.deviceDefault') },
    ...devices.map((d) => ({ id: d.deviceId, label: d.label })),
  ];

  const isDefault = !selectedSinkId || selectedSinkId === DEFAULT_DEVICE_ID;
  const currentValue = isDefault ? DEFAULT_DEVICE_ID : selectedSinkId;

  return (
    <section
      data-testid="audio-output-section"
      className="mb-6 flex w-full flex-col items-start justify-start"
    >
      <h2 className="mb-3 flex w-full flex-0 flex-row text-left text-2xl font-bold">
        {t('audioOutput.title')}
      </h2>
      <div className="flex w-full flex-1 flex-col">
        <Select
          label={t('audioOutput.deviceLabel')}
          description={t('audioOutput.deviceDescription')}
          options={options}
          value={currentValue}
          onValueChange={(value) => {
            if (value === DEFAULT_DEVICE_ID) {
              selectDevice('');
            } else {
              selectDevice(value);
            }
          }}
        />
      </div>
    </section>
  );
};
