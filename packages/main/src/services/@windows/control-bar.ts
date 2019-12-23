import { PlaybackStatus } from '@nuclear/common';
import { nativeImage, Event } from 'electron';
import { inject, injectable } from 'inversify';
import path from 'path';

import { ControlBarState } from '../../interfaces/control-bar';
// import WithState from '../../utils/withState';
import Window from '../window';
import Config from '../config';
import Logger, { mainLogger } from '../logger';

const initialState: ControlBarState = {
  status: PlaybackStatus.PAUSED,
  canNext: true,
  canPrevious: true
};

@injectable()
class WindowsControlBar {
  private iconsPath = this.config.isProd() ? './resources/media' : '../../../resources/media';
  private playIcon = path.resolve(__dirname, this.iconsPath, 'play.svg');
  private pauseIcon = path.resolve(__dirname, this.iconsPath, 'pause.svg');
  private state = initialState;

  rendererWindow: Event['sender'];

  constructor(
    @inject(Config) private config: Config,
    @inject(mainLogger) private logger: Logger,
    @inject(Window) private window: Window,
  ) {}

  private setState(update: Partial<typeof initialState>) {
    this.state = {
      ...this.state,
      ...update,
    }

    this.render();
  }

  private isPlaying() {
    return this.state.status === PlaybackStatus.PLAYING;
  }

  onPlaypause() {
    this.rendererWindow.send('playpause');

    this.setState({
      status: this.isPlaying() ? PlaybackStatus.PAUSED : PlaybackStatus.PLAYING
    });
  }

  onPrevious() {
    this.rendererWindow.send('previous');
  }

  onNext() {
    this.rendererWindow.send('next');
  }

  render() {
    const foo = this.window.setThumbarButtons([
      {
        click: this.onPrevious,
        icon: nativeImage.createFromPath(path.resolve(__dirname, this.iconsPath, 'previous.svg')),
        tooltip: 'previous track'
      },
      {
        click: this.onPlaypause,
        icon: nativeImage.createFromPath(this.isPlaying() ? this.playIcon : this.pauseIcon),
        tooltip: 'play/pause'
      },
      {
        click: this.onNext,
        icon: nativeImage.createFromPath(path.resolve(__dirname, this.iconsPath, 'next.svg')),
        tooltip: 'next track'
      }
    ]);

    this.logger.log('is thumbar attached ', foo);
  }
}

export default WindowsControlBar;
