import { FC } from 'react';

import { useQueueStore } from '../stores/queueStore';
import { useSettingsModalStore } from '../stores/settingsModalStore';
import { getSetting, setSetting } from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';
import { useShortcut } from './useShortcut';

export const GlobalShortcuts: FC = () => {
  useShortcut('playback.toggle', () => {
    useSoundStore.getState().toggle();
  });

  useShortcut('playback.next', () => {
    useQueueStore.getState().goToNext();
  });

  useShortcut('playback.previous', () => {
    useQueueStore.getState().goToPrevious();
  });

  useShortcut('playback.seekForward', () => {
    const { seek, duration } = useSoundStore.getState();
    const skipSeconds =
      (getSetting('core.playback.skipSeconds') as number) ?? 5;
    useSoundStore.getState().seekTo(Math.min(seek + skipSeconds, duration));
  });

  useShortcut('playback.seekBackward', () => {
    const { seek } = useSoundStore.getState();
    const skipSeconds =
      (getSetting('core.playback.skipSeconds') as number) ?? 5;
    useSoundStore.getState().seekTo(Math.max(0, seek - skipSeconds));
  });

  useShortcut('playback.volumeUp', () => {
    const volume = getSetting('core.playback.volume') as number;
    void setSetting('core.playback.volume', Math.min(1, volume + 0.05));
  });

  useShortcut('playback.volumeDown', () => {
    const volume = getSetting('core.playback.volume') as number;
    void setSetting('core.playback.volume', Math.max(0, volume - 0.05));
  });

  useShortcut('playback.mute', () => {
    const muted = getSetting('core.playback.muted') as boolean;
    void setSetting('core.playback.muted', !muted);
  });

  useShortcut('general.toggleSettings', () => {
    const { isOpen, open, close } = useSettingsModalStore.getState();
    if (isOpen) {
      close();
    } else {
      open();
    }
  });

  return null;
};
