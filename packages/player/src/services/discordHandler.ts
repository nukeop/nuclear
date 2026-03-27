import { invoke } from '@tauri-apps/api/core';

import { getSetting, useSettingsStore } from '../stores/settingsStore';
import { errorMessage } from '../utils/error';
import { Logger } from './logger';

const DISCORD_ENABLED_SETTING = 'core.integrations.discord.enabled';

const connect = () => invoke('discord_connect');
const disconnect = () => invoke('discord_disconnect');

const watchSettings = () => {
  let previouslyEnabled = getSetting(DISCORD_ENABLED_SETTING);

  useSettingsStore.subscribe((state) => {
    const enabled = state.getValue(DISCORD_ENABLED_SETTING);
    if (enabled === previouslyEnabled) {
      return;
    }
    previouslyEnabled = enabled;

    if (enabled) {
      connect().catch((err) =>
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

export const initDiscordHandler = async () => {
  watchSettings();

  if (getSetting(DISCORD_ENABLED_SETTING)) {
    await connect();
  }
};
