import { NuclearMeta } from '@nuclear/core';
import DiscordRPC from 'discord-rpc';
import { injectable, inject } from 'inversify';

import Config from '../config';
import Logger, { $mainLogger } from '../logger';

@injectable()
class Discord {
  private rpc: DiscordRPC.Client;
  private isReady = false;
  private baseStart: number;
  private pauseStart: number;
  private pausedTotal = 0;
  private activity: {
    details: string;
    startTimestamp: number;
    largeImageKey: string;
  };
  private interval: NodeJS.Timeout;

  private get pausedStartTime() {
    return this.baseStart + (this.pausedTotal + Date.now() - this.pauseStart);
  }

  constructor(
    @inject(Config) private config: Config,
    @inject($mainLogger) private logger: Logger
  ) {}

  private async sendActivity() {
    try {
      await this.rpc.setActivity(this.activity);
    } catch (err) {
      this.logger.error('error trying to set discord activity');
    }
  }

  async pause() {
    if (this.isReady) {
      this.pauseStart = Date.now();
  
      this.activity.details += '\nPaused';
      this.interval = setInterval(() => {
        this.activity.startTimestamp = this.pausedStartTime;
        this.sendActivity();
      }, 500);
      this.activity.startTimestamp = this.pausedStartTime;
      return this.sendActivity();
    }
  }

  async play() {
    if (this.isReady) {
      this.pausedTotal += Date.now() - this.pauseStart;
      clearInterval(this.interval);
      if (this.activity) {
        this.activity.details = this.activity.details.substr(0, this.activity.details.length - 8);
        return this.sendActivity();
      }
    }
  }

  async init(cb?: () => void) {
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

  async trackChange(track: NuclearMeta) {
    clearInterval(this.interval);
    this.baseStart = Date.now();
    this.pausedTotal = 0;
    this.activity = {
      details: `${track.artist} - ${track.name}`,
      startTimestamp: this.baseStart,
      largeImageKey: 'logo'
    };
    if (!this.rpc) {
      return null;
    } else if (!this.isReady) {
      return this.init(() => {
        this.sendActivity();
      });
    } else {
      this.sendActivity();
    }
  }

  clear() {
    clearInterval(this.interval);
    if (this.isReady) {
      this.rpc.clearActivity();
    }
  }
}

export default Discord;
