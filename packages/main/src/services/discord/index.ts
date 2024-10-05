import { NuclearMeta } from '@nuclear/core';
import DiscordRPC from 'discord-rpc';
import { injectable, inject } from 'inversify';

import Config from '../config';
import Logger, { $mainLogger } from '../logger';

@injectable()
class Discord {
  private rpc: DiscordRPC.Client;
  private isReady = false;
  private isPaused = false;
  private baseStart: number;
  private pauseStart: number;
  private pausedTotal = 0;
  private activity: {
    details: string;
    startTimestamp: number;
    largeImageKey: string;
  };

  constructor(
    @inject(Config) private config: Config,
    @inject($mainLogger) private logger: Logger
  ) {}

  private async sendActivity() {
    try {
      await this.rpc.setActivity(this.activity);
      this.logger.log('update discord activity');
    } catch (err) {
      this.logger.error('error trying to set discord activity');
    }
  }

  async pause() {
    if (this.isReady && this.activity) {
      this.pauseStart = Date.now();
  
      this.activity.details = `${this.activity.details} (Paused)`;
      this.isPaused = true;
      this.activity.startTimestamp = this.pauseStart;
      return this.sendActivity();
    }
  }

  async play() {
    if (this.isReady && this.activity) {
      this.pausedTotal += Date.now() - this.pauseStart;
      if (this.activity) {
        if (this.isPaused) {
          // Remove "(Paused)" after song title
          this.activity.details = this.activity.details.substring(0, this.activity.details.length - 9);
          this.isPaused = false;
        }
        this.activity.startTimestamp = this.baseStart + this.pausedTotal;
        return this.sendActivity();
      }
    }
  }

  async init(cb?: () => void) {
    DiscordRPC.register(this.config.discordClientId);
    this.rpc = new DiscordRPC.Client({ transport: 'ipc' });

    this.rpc.once('ready', () => {
      this.logger.log('connected to discord');
      this.isReady = true;
      cb && cb();
    });

    try {
      await this.rpc.login({ clientId: this.config.discordClientId });
    } catch (err) {
      this.logger.log('error trying to connect discord');
      this.isReady = true;
    }
  }

  async trackChange(track: NuclearMeta) {
    this.isPaused = false;
    this.baseStart = Date.now();
    this.pausedTotal = 0;
    this.activity = {
      details: `${track.artists[0]} - ${track.name}`,
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

  async clear() {
    delete this.activity;
    if (this.isReady) {
      try {
        this.logger.log('Clearing Discord activity');
        await this.rpc.clearActivity();
      } catch (e) {
        this.logger.error('Could not clear discord activity');
        this.logger.error(e);
      }
    }
  }
}

export default Discord;
