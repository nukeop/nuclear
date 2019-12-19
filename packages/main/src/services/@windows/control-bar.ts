import { PlaybackStatus } from '@nuclear/common';
import { NativeImage, Event } from 'electron';
import { inject, injectable } from 'inversify';
import path from 'path';

import { ControlBarState } from '../../interfaces/control-bar';
import WithState from '../../utils/withState';
import Window from '../window';
import Config from '../config';

const initialState: ControlBarState = {
  status: PlaybackStatus.PAUSED,
  canNext: true,
  canPrevious: true
};

@injectable()
class WindowsControlBar extends WithState<ControlBarState> {
  private iconsPath = this.config.isProd() ? './resources/media' : '../../../resources/media';
  private playIcon = path.resolve(__dirname, this.iconsPath, 'play.svg');
  private pauseIcon = path.resolve(__dirname, this.iconsPath, 'pause.svg');
  
  rendererWindow: Event['sender'];

  constructor(
    @inject(Window) private window: Window,
    @inject(Config) private config: Config
  ) {
    super(initialState);
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
    this.window.setThumbarButtons([
      {
        click: this.onPrevious,
        icon: NativeImage.createFromPath(path.resolve(__dirname, this.iconsPath, 'previous.svg')),
        tooltip: 'previous track'
      },
      {
        click: this.onPlaypause,
        icon: NativeImage.createFromPath(this.isPlaying() ? this.playIcon : this.pauseIcon),
        tooltip: 'play/pause'
      },
      {
        click: this.onNext,
        icon: NativeImage.createFromPath(path.resolve(__dirname, this.iconsPath, 'next.svg')),
        tooltip: 'next track'
      }
    ]);
  }
}

export default WindowsControlBar;
