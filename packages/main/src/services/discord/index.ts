/* eslint-disable @typescript-eslint/no-explicit-any */
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

  private async sendActivity(track: NuclearMeta) {
    try {
      await this.rpc.setActivity({
        details: `${track.artist} - ${track.name}`,
        startTimestamp: Date.now(),
        largeImageKey: 'logo'
      });
    } catch (err) {
      this.logger.error('error trying to set discord activity');
    }
  }

  async init(cb?: () => any) {
    DiscordRPC.register(this.config.discordClientId);
    this.rpc = new DiscordRPC.Client({ transport: 'ipc' });

    this.rpc.once('ready', () => {
      this.isReady = true;
      cb && cb();
    });

    try {
      await this.rpc.login({ clientId: this.config.discordClientId });
    } catch (err) {
      this.logger.log('error trying to connect discord');
    }
  }

  async setActivity(track: NuclearMeta) {
    if (!this.rpc) {
      return null;
    } else if (!this.isReady) {
      return this.init(() => {
        this.sendActivity(track);
      });
    }

    this.sendActivity(track);
  }
}

export default Discord;
