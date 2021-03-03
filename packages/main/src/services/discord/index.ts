import { NuclearMeta } from '@nuclear/core';
import DiscordRPC from 'discord-rpc';
import { injectable, inject } from 'inversify';

import Config from '../config';
import Logger, { $mainLogger } from '../logger';

@injectable()
class Discord {
  private rpc: DiscordRPC.Client;
  private isReady = false;

  private currentTrack: NuclearMeta;
  private paused: boolean;

  constructor(
    @inject(Config) private config: Config,
    @inject($mainLogger) private logger: Logger
  ) {}

  async pause() {
    if (!this.isReady) {
      await this.init();
    }
    this.paused = true;
    await this.updatePresence();
  }

  async play() {
    if (!this.isReady) {
      await this.init();
    }
    this.paused = false;
    await this.updatePresence();
  }

  async init() {
    DiscordRPC.register(this.config.discordClientId);
    this.rpc = new DiscordRPC.Client({ transport: 'ipc' });

    try {
      await this.rpc.login({ clientId: this.config.discordClientId });
    } catch (err) {
      this.logger.log('error trying to connect discord');
      return;
    }

    await new Promise<void>(res => this.rpc.once('ready', res));
    
    this.logger.log('connected to discord');
    this.isReady = true;
  }

  async trackChange(track: NuclearMeta) {
    if (!this.rpc) {
      return null;
    }
    if (!this.isReady) {
      await this.init();
    }
    this.currentTrack = track;
    await this.updatePresence();
  }

  async updatePresence() {
    try {
      const activity: DiscordRPC.Presence = {
        details: 'Idle',
        startTimestamp: null,
        largeImageKey: 'logo'
      };
      
      if (this.currentTrack) {
        activity.details = `${this.currentTrack.artist} - ${this.currentTrack.name}`;
        if (this.paused) {
          activity.details += '\nPaused';
        } else {
          activity.startTimestamp = Date.now() - this.currentTrack.position;
        }
      }

      await this.rpc.setActivity(activity);
      this.logger.log('updated discord activity');
    } catch (err) {
      this.logger.log(err);
      this.logger.error('error trying to set discord activity');
    }
  }

  clear() {
    if (this.isReady) {
      this.logger.log('clear discord activity');
      this.rpc.clearActivity();
    }
  }
}

export default Discord;
