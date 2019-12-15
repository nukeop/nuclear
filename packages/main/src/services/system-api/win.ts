import { NuclearStatus, PlaybackStatus } from '@nuclear/common';
import { Event, nativeImage, NativeImage, IpcMain } from 'electron';
import { inject } from 'inversify';
import path from 'path';

import NuclearApi from '../../utils/nuclear-api';
import Config from '../config';
import Ipc from '../ipc';
import Window from '../window';

class Thumbar implements NuclearApi {
  private status: NuclearStatus;
  private previousIcon = this.createNativeImage('previous.sg');
  private playIcon = this.createNativeImage('play.svg');
  private pauseIcon = this.createNativeImage('pause.svg');
  private nextIcon = this.createNativeImage('next.svg');

  public rendererWindow: Event['sender'];

  constructor(
    @inject(Config) private config: Config,
    @inject(Ipc) private ipc: IpcMain,
    @inject(Window) private window: Window
  ) {}

  private getPlayingStatus(): Promise<NuclearStatus> {
    return new Promise(resolve => {
      this.rendererWindow.send('playing-status');
      this.ipc.once('playing-status', (evt: Event, data: NuclearStatus) => {
        resolve(data);
      });
    });
  }

  private updateStatus(diff: Partial<NuclearStatus>) {
    this.status = {
      ...this.status,
      ...diff,
    };
    this.renderThumbarButtons();
  }

  private createNativeImage(imagePath: string): NativeImage {
    const resourcesPath = this.config.isProd() ? 'resources/controls' : '../../app/resources/controls';

    return nativeImage.createFromPath(path.resolve(__dirname, resourcesPath,  imagePath))
  }

  private renderThumbarButtons() {
    this.window.setThumbarButtons([
      {
        tooltip: 'previous',
        icon: this.previousIcon,
        flags: ['enabled'],
        click: this.onPrevious
      },
      {
        tooltip: 'play/pause',
        icon: this.status.playbackStatus === PlaybackStatus.PLAYING ? this.pauseIcon : this.playIcon,
        flags: ['enabled', 'dismissonclick'],
        click: this.onPlayPause
      },
      {
        tooltip: 'next',
        icon: this.nextIcon,
        flags: ['enabled'],
        click: this.onNext
      }
    ])
  }

  onPlayPause(): void {
    this.rendererWindow.send('playpause');
  }

  onPlay(): void {
    this.rendererWindow.send('play');
  }

  onPause(): void {
    this.rendererWindow.send('pause');
  }

  onNext(): void {
    this.rendererWindow.send('next');
  }

  onPrevious(): void {
    this.rendererWindow.send('previous');
  }

  play() {
    this.updateStatus({
      playbackStatus: PlaybackStatus.PLAYING
    });
  }

  pause() {
    this.updateStatus({
      playbackStatus: PlaybackStatus.PAUSED
    });
  }

  async listen(): Promise<void> {
    this.status = await this.getPlayingStatus();
    this.renderThumbarButtons();
  }
}

export default Thumbar;
