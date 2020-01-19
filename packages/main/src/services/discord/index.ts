import { NuclearMeta } from '@nuclear/core';
import DiscordRPC from 'discord-rpc';
import { injectable, inject } from 'inversify';

import Config from '../config';
import Logger, { $mainLogger } from '../logger';

@injectable()
class Discord {
  private rpc: DiscordRPC.Client;
  private isReady = false;

  constructor(
    @inject(Config) private config: Config,
    @inject($mainLogger) private logger: Logger
  ) {}

  async setActivity(track: NuclearMeta) {
    if (!this.rpc || !this.isReady) {
      return null;
    }

    try {
      await this.rpc.setActivity({
        details: `listening to ${track.artist} ${track.name}`,
        startTimestamp: Date.now(),
        largeImageKey: 'logo'
      });
    } catch (err) {
      this.logger.error(err);
    }

  }

  async init() {
    DiscordRPC.register(this.config.discordClientId);
    this.rpc = new DiscordRPC.Client({ transport: 'ipc' });

    this.rpc.on('ready', () => {
      this.isReady = true;
    });
    
    try {
      await this.rpc.login({ clientId: this.config.discordClientId });
    } catch (err) {
      this.logger.error(err);
    }
  }
}

export default Discord;
