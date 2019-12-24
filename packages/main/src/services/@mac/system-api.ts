import { NuclearStatus, NuclearMeta, NuclearPlaylist, PlaybackStatus } from '@nuclear/common';
import { Event, IpcMain } from 'electron';
import MediaService, { MediaMetadata, MediaState } from 'electron-media-service';
import { inject } from 'inversify';

import { SYSTEM_MEDIA_EVENT_KEY, systemMediaController, systemMediaEvent } from '../../utils/decorators';
import NuclearApi from '../../interfaces/nuclear-api';
import { ControllerMeta, MediaEventName } from '../../utils/types';
import Ipc from '../ipc';
import Logger, { systemApiLogger } from '../logger';

const statusMapper: Record<PlaybackStatus, MediaState> = {
  [PlaybackStatus.PLAYING]: 'playing',
  [PlaybackStatus.PAUSED]: 'paused',
  [PlaybackStatus.STOPPED]: 'stopped'
};

@systemMediaController()
class MacMediaService extends MediaService implements NuclearApi {
  private ipc: IpcMain;
  private status: MediaMetadata;

  rendererWindow: Event['sender'];

  constructor(
    @inject(Ipc) ipc: IpcMain,
    @inject(systemApiLogger) private logger: Logger
  ) {
    super();

    this.ipc = ipc;
  }

  private getPlayingStatus(): Promise<NuclearStatus> {
    return new Promise(resolve => {
      this.rendererWindow.send('playing-status');
      this.ipc.once('playing-status', (evt: Event, data: NuclearStatus) => {
        resolve(data);
      });
    });
  }

  private trackMapper(track: NuclearMeta, index = 0): Partial<MediaMetadata> {
    return {
      album: '',
      albumArt: track.thumbnail,
      artist: track.artist,
      title: track.name,
      duration: track.streams[0].duration,
    };
  }


  @systemMediaEvent('play')
  onPlay() {
    this.rendererWindow.send('play');
  }

  @systemMediaEvent('pause')
  onPause() {
    this.rendererWindow.send('pause');
  }

  @systemMediaEvent('playpause')
  onPlayPause() {
    this.rendererWindow.send('playpause');
  }

  @systemMediaEvent('next')
  onNext() {
    this.rendererWindow.send('next');
  }

  @systemMediaEvent('previous')
  onPrevious() {
    this.rendererWindow.send('previous');
  }

  @systemMediaEvent('seek')
  onSeek(position: number) {
    this.rendererWindow.send('seek', position);
  }


  play() {
    this.status.state = 'playing';
    this.setMetaData(this.status);
  }

  pause() {
    this.status.state = 'paused';
    this.setMetaData(this.status);
  }

  sendMetadata(meta: NuclearMeta) {
    this.setMetaData({
      ...this.status,
      ...this.trackMapper(meta),
    });
  }

  async listen() {
    this.startService();

    const status = await this.getPlayingStatus();

    this.status = {
      album: '',
      albumArt: '',
      artist: '',
      currentTime: 0,
      duration: 0,
      id: 0,
      state: statusMapper[status.playbackStatus],
      title: ''
    }

    this.setMetaData(this.status);

    const meta: ControllerMeta<MediaEventName>[] = Reflect.getMetadata(SYSTEM_MEDIA_EVENT_KEY, MacMediaService.prototype);

    meta.forEach(({ eventName, name }) => {

      this.on(eventName, (data: any) => {
        this.logger.log(`incomming event => ${eventName}`);

        const result = (this as any)[name](data);

        if (result instanceof Promise) {
          result.catch((err: Error) => {
            this.logger.error(`error in event ${eventName} => ${err.message}`);
          });
        }
      });
    });
  }
}

export default MacMediaService;
