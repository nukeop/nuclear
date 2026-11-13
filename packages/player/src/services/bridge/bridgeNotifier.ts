import { invoke } from '@tauri-apps/api/core';

import type { SoundStatus } from '@nuclearplayer/hifi';

import { useQueueStore } from '../../stores/queue/queueStore';
import { useSoundStore } from '../../stores/soundStore';
import { playbackSettings } from '../playbackSettings';
import { BridgeCommand } from '../tauri/bridge';

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

export const initBridgeNotifier = (): void => {
  watchSoundStatus();
  watchQueueIndex();
  watchQueueContents();
  playbackSettings.onVolumeChange(notifyMixer);
  playbackSettings.onRepeatModeChange(notifyOptions);
  playbackSettings.onShuffleChange(notifyOptions);
};
