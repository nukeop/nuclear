import { invoke } from '@tauri-apps/api/core';

import type { SoundStatus } from '@nuclearplayer/hifi';
import { formatArtistNames, type Track } from '@nuclearplayer/model';

import { useQueueStore } from '../stores/queueStore';
import { getSetting, useSettingsStore } from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';
import { errorMessage } from '../utils/error';
import { Logger } from './logger';

const DISCORD_ENABLED_SETTING = 'core.integrations.discord.enabled';

type TrackPresence = {
  title: string;
  artist: string;
  album?: string;
  artworkUrl?: string;
  startTimestamp?: number;
  endTimestamp?: number;
};

const connect = () => invoke('discord_connect');
const disconnect = () => invoke('discord_disconnect');
const setActivity = (track: TrackPresence) =>
  invoke('discord_set_activity', { track });
const clearActivity = () => invoke('discord_clear_activity');

const isEnabled = () => getSetting(DISCORD_ENABLED_SETTING);

const playbackTimestamps = (seek: number, duration: number) => {
  const nowSeconds = Math.floor(Date.now() / 1000);

  return {
    startTimestamp: nowSeconds - Math.floor(seek),
    endTimestamp: nowSeconds + Math.floor(duration - seek),
  };
};

const buildPresence = (
  track: Track,
  status: SoundStatus,
  seek: number,
  duration: number,
): TrackPresence => ({
  title: track.title,
  artist: formatArtistNames(track.artists),
  album: track.album?.title,
  artworkUrl: track.artwork?.items[0]?.url,
  ...(status === 'playing' ? playbackTimestamps(seek, duration) : {}),
});

const updatePresence = () => {
  if (!isEnabled()) {
    return;
  }

  const currentItem = useQueueStore.getState().getCurrentItem();
  const { status, seek, duration } = useSoundStore.getState();

  if (!currentItem || status === 'stopped') {
    clearActivity().catch(() => {});
    return;
  }

  const presence = buildPresence(currentItem.track, status, seek, duration);
  setActivity(presence).catch((err) =>
    Logger.discord.error(`Failed to set activity: ${errorMessage(err)}`),
  );
};

const watchPlayback = () => {
  let previousItemId: string | undefined;
  let previousStatus: SoundStatus = 'stopped';

  useQueueStore.subscribe((state) => {
    const currentItem = state.getCurrentItem();
    if (currentItem?.id !== previousItemId) {
      previousItemId = currentItem?.id;
      updatePresence();
    }
  });

  let previousDuration = 0;

  useSoundStore.subscribe((state) => {
    const statusChanged = state.status !== previousStatus;
    const durationBecameAvailable =
      previousDuration === 0 && state.duration > 0;

    if (statusChanged || durationBecameAvailable) {
      previousStatus = state.status;
      previousDuration = state.duration;
      updatePresence();
    }
  });
};

const watchSettings = () => {
  let previouslyEnabled = getSetting(DISCORD_ENABLED_SETTING);

  useSettingsStore.subscribe((state) => {
    const enabled = state.getValue(DISCORD_ENABLED_SETTING);
    if (enabled === previouslyEnabled) {
      return;
    }
    previouslyEnabled = enabled;

    if (enabled) {
      connect()
        .then(() => updatePresence())
        .catch((err) =>
          Logger.discord.error(
            `Failed to connect to Discord: ${errorMessage(err)}`,
          ),
        );
    } else {
      disconnect().catch((err) =>
        Logger.discord.error(
          `Failed to disconnect from Discord: ${errorMessage(err)}`,
        ),
      );
    }
  });
};

export const initDiscordHandler = () => {
  watchSettings();
  watchPlayback();

  if (getSetting(DISCORD_ENABLED_SETTING)) {
    connect().catch((err) =>
      Logger.discord.error(
        `Failed to connect to Discord: ${errorMessage(err)}`,
      ),
    );
  }
};
