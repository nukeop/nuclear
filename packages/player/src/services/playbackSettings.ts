import type { RepeatMode } from '@nuclearplayer/model';

import {
  getSetting,
  setSetting,
  useSettingsStore,
} from '../stores/settingsStore';

const SHUFFLE = 'core.playback.shuffle';
const REPEAT = 'core.playback.repeat';
const VOLUME = 'core.playback.volume';
const MUTED = 'core.playback.muted';

class PlaybackSettings {
  get shuffleEnabled() {
    return (getSetting(SHUFFLE) as boolean) ?? false;
  }

  get repeatMode() {
    return (getSetting(REPEAT) as RepeatMode) ?? 'off';
  }

  get volume() {
    return (getSetting(VOLUME) as number) ?? 1;
  }

  get muted() {
    return (getSetting(MUTED) as boolean) ?? false;
  }

  setShuffleEnabled(shuffleEnabled: boolean) {
    return setSetting(SHUFFLE, shuffleEnabled);
  }

  setRepeatMode(repeatMode: RepeatMode) {
    return setSetting(REPEAT, repeatMode);
  }

  setVolume(volume: number) {
    return setSetting(VOLUME, volume);
  }

  setMuted(muted: boolean) {
    return setSetting(MUTED, muted);
  }

  onShuffleChange(listener: (shuffleEnabled: boolean) => void) {
    this.onChange(() => this.shuffleEnabled, listener);
  }

  onRepeatModeChange(listener: (repeatMode: RepeatMode) => void) {
    this.onChange(() => this.repeatMode, listener);
  }

  onVolumeChange(listener: (volume: number) => void) {
    this.onChange(() => this.volume, listener);
  }

  private onChange<Value>(read: () => Value, listener: (value: Value) => void) {
    let previousValue = read();
    useSettingsStore.subscribe(() => {
      const value = read();
      if (value === previousValue) {
        return;
      }
      previousValue = value;
      listener(value);
    });
  }
}

export const playbackSettings = new PlaybackSettings();
