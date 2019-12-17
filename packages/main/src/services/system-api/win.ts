import { MediaPlaybackStatus, MediaPlaybackType, SystemMediaTransportControlsButton } from '@nodert-win10/windows.media';
import { BackgroundMediaPlayer } from '@nodert-win10/windows.media.playback';
import { RandomAccessStreamReference } from '@nodert-win10/windows.storage.streams';
import { Uri } from '@nodert-win10/windows.foundation';
import { NuclearStatus, PlaybackStatus, NuclearMeta } from '@nuclear/common';
import { Event, IpcMain } from 'electron';
import { inject, injectable } from 'inversify';

import Ipc from '../ipc';
import Config from '../config';
import NuclearApi from '../../utils/nuclear-api';
import { mprisController } from '../../utils/decorators';

@mprisController()
class WindowsMediaService implements NuclearApi {
  private controls: any;
  rendererWindow: Event['sender'];

  constructor(
    @inject(Config) private config: Config,
    @inject(Ipc) private ipc: IpcMain
  ) {}

  private getPlayingStatus(): Promise<NuclearStatus> {
    return new Promise(resolve => {
      this.rendererWindow.send('playing-status');
      this.ipc.once('playing-status', (evt: Event, data: NuclearStatus) => {
        resolve(data);
      });
    });
  }

  onPlay() {
    this.rendererWindow.send('play');
  }
  
  onPause() {
    this.rendererWindow.send('pause');
  }

  onStop() {
    this.rendererWindow.send('stop');
  }

  onNext() {
    this.rendererWindow.send('next');
  }

  onPrevious() {
    this.rendererWindow.send('previous');
  }

  play() {
    this.controls.playbackStatus = MediaPlaybackStatus.playing;
  }
  
  pause() {
    this.controls.playbackStatus = MediaPlaybackStatus.paused;
  }

  sendMetadata(track: NuclearMeta) {
    this.controls.displayUpdater.musicProperties.artist = track.artist;
    this.controls.displayUpdater.musicProperties.title = track.name;

    // this.controls.displayUpdater.musicProperties.albumTitle = track.genre || '';
    this.controls.displayUpdater.thumbnail = track.thumbnail ? RandomAccessStreamReference.createFromUri(new Uri(track.thumbnail)) : '';

    this.controls.displayUpdater.update();
  }

  listen() {
    this.controls = BackgroundMediaPlayer.current.systemMediaTransportControls;

    this.controls.isChannelDownEnabled = false;
    this.controls.isChannelUpEnabled = false;
    this.controls.isFastForwardEnabled = false;
    this.controls.isNextEnabled = true;
    this.controls.isPauseEnabled = true;
    this.controls.isPlayEnabled = true;
    this.controls.isPreviousEnabled = true;
    this.controls.isRecordEnabled = false;
    this.controls.isRewindEnabled = false;
    this.controls.isStopEnabled = true;
    this.controls.playbackStatus = MediaPlaybackStatus.closed;
    this.controls.displayUpdater.type = MediaPlaybackType.music;

    this.controls.displayUpdater.musicProperties.title = this.config.title;
    this.controls.displayUpdater.musicProperties.artist = 'No track';
    this.controls.displayUpdater.update();

    this.controls.on('buttonpressed', (_sender: any, eventArgs: any) => {
      switch (eventArgs.button) {
        case SystemMediaTransportControlsButton.play:
          this.onPlay()
          break;
        case SystemMediaTransportControlsButton.pause:
          this.onPause();
          break;
        case SystemMediaTransportControlsButton.stop:
          this.onStop();
          break;
        case SystemMediaTransportControlsButton.next:
          this.onNext()
          break;
        case SystemMediaTransportControlsButton.previous:
          this.onPrevious()
          break;
        default:
          break;
      }
    });
  }
}

export default WindowsMediaService;
