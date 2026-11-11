import { FC } from 'react';

import { playbackManager } from '../services/playback';
import { playbackSettings } from '../services/playbackSettings';
import { useQueueStore } from '../stores/queue/queueStore';
import { useSettingsModalStore } from '../stores/settingsModalStore';
import { getSetting } from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';
import { useShortcut } from './useShortcut';

export const GlobalShortcuts: FC = () => {
  useShortcut('playback.toggle', () => {
    playbackManager.toggle();
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
    void playbackSettings.setVolume(
      Math.min(1, playbackSettings.volume + 0.05),
    );
  });

  useShortcut('playback.volumeDown', () => {
    void playbackSettings.setVolume(
      Math.max(0, playbackSettings.volume - 0.05),
    );
  });

  useShortcut('playback.mute', () => {
    void playbackSettings.setMuted(!playbackSettings.muted);
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
