import { invoke } from '@tauri-apps/api/core';

import type { SoundStatus } from '@nuclearplayer/hifi';
import type { SettingValue } from '@nuclearplayer/plugin-sdk';

import { useQueueStore } from '../../stores/queueStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useSoundStore } from '../../stores/soundStore';
import { BridgeCommand } from '../tauri/bridge';

const VOLUME_SETTING = 'core.playback.volume';

const notifyPlayer = () =>
  void invoke(BridgeCommand.notify, { notification: { subsystem: 'player' } });

const notifyMixer = () =>
  void invoke(BridgeCommand.notify, { notification: { subsystem: 'mixer' } });

const watchSoundStatus = () => {
  let previousStatus: SoundStatus = useSoundStore.getState().status;

  useSoundStore.subscribe((state) => {
    if (state.status === previousStatus) {
      return;
    }
    previousStatus = state.status;
    notifyPlayer();
  });
};

const watchQueueIndex = () => {
  let previousIndex: number = useQueueStore.getState().currentIndex;

  useQueueStore.subscribe((state) => {
    if (state.currentIndex === previousIndex) {
      return;
    }
    previousIndex = state.currentIndex;
    notifyPlayer();
  });
};

const watchVolume = () => {
  let previousVolume: SettingValue = useSettingsStore
    .getState()
    .getValue(VOLUME_SETTING);

  useSettingsStore.subscribe((state) => {
    const volume = state.getValue(VOLUME_SETTING);
    if (volume === previousVolume) {
      return;
    }
    previousVolume = volume;
    notifyMixer();
  });
};

export const initBridgeNotifier = (): void => {
  watchSoundStatus();
  watchQueueIndex();
  watchVolume();
};
