import { FC } from 'react';

import { PlayerBar } from '@nuclearplayer/ui';

import { useSettingsStore } from '../../stores/settingsStore';

export const ConnectedVolume: FC = () => {
  const volume = useSettingsStore(
    (s) => (s.getValue('core.playback.volume') as number) ?? 1,
  );
  const setValue = useSettingsStore((s) => s.setValue);

  const handleVolumeChange = (value: number) => {
    setValue('core.playback.volume', value / 100);
  };

  return (
    <PlayerBar.Volume
      value={Math.round(volume * 100)}
      onValueChange={handleVolumeChange}
    />
  );
};
