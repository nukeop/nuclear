import { invoke } from '@tauri-apps/api/core';

import type { SoundStatus } from '@nuclearplayer/hifi';
import type { SettingValue } from '@nuclearplayer/plugin-sdk';

import { useQueueStore } from '../../stores/queueStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useSoundStore } from '../../stores/soundStore';
import { BridgeCommand } from '../tauri/bridge';

const VOLUME_SETTING = 'core.playback.volume';
const REPEAT_SETTING = 'core.playback.repeat';
const SHUFFLE_SETTING = 'core.playback.shuffle';

const notifyPlayer = () =>
  void invoke(BridgeCommand.notify, { notification: { subsystem: 'player' } });

const notifyPlaylist = () =>
  void invoke(BridgeCommand.notify, {
    notification: { subsystem: 'playlist' },
  });

const notifyMixer = () =>
  void invoke(BridgeCommand.notify, { notification: { subsystem: 'mixer' } });

const notifyOptions = () =>
  void invoke(BridgeCommand.notify, {
    notification: { subsystem: 'options' },
  });

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

const itemFingerprint = () =>
  useQueueStore
    .getState()
    .items.map((item) => item.id)
    .join(',');

const watchQueueContents = () => {
  let previousFingerprint = itemFingerprint();

  useQueueStore.subscribe(() => {
    const fingerprint = itemFingerprint();
    if (fingerprint === previousFingerprint) {
      return;
    }
    previousFingerprint = fingerprint;
    notifyPlaylist();
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

const watchOptions = () => {
  const getValues = () => ({
    repeat: useSettingsStore.getState().getValue(REPEAT_SETTING),
    shuffle: useSettingsStore.getState().getValue(SHUFFLE_SETTING),
  });

  let previous = getValues();

  useSettingsStore.subscribe((state) => {
    const repeat = state.getValue(REPEAT_SETTING);
    const shuffle = state.getValue(SHUFFLE_SETTING);
    if (repeat === previous.repeat && shuffle === previous.shuffle) {
      return;
    }
    previous = { repeat, shuffle };
    notifyOptions();
  });
};

export const initBridgeNotifier = (): void => {
  watchSoundStatus();
  watchQueueIndex();
  watchQueueContents();
  watchVolume();
  watchOptions();
};
