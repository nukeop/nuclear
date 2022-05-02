/* eslint-disable @typescript-eslint/no-empty-function */
import NuclearApi from '../../interfaces/nuclear-api';
import { injectable } from 'inversify';

@injectable()
class MacOsMediaService implements NuclearApi {
  onPause() {}
  onPlay() {}
  pause() {}
  play() {}
  listen() {}
}

export default MacOsMediaService;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NuclearStatus, NuclearMeta, PlaybackStatus } from '@nuclear/core';
// import { Event, IpcMain } from 'electron';
// import MediaService, { MediaMetadata, MediaState } from 'electron-media-service';
// import { inject } from 'inversify';

// import { SYSTEM_MEDIA_EVENT_KEY, systemMediaController, systemMediaEvent } from '../../utils/decorators';
// import NuclearApi from '../../interfaces/nuclear-api';
// import { ControllerMeta, MediaEventName } from '../../utils/types';
// import $ipc from '../ipc';
// import Logger, { $systemApiLogger } from '../logger';
// import Window from '../window';

// const statusMapper: Record<PlaybackStatus, MediaState> = {
//   [PlaybackStatus.PLAYING]: 'playing',
//   [PlaybackStatus.PAUSED]: 'paused',
//   [PlaybackStatus.STOPPED]: 'stopped'
// };

// @systemMediaController()
// class MacMediaService extends MediaService implements NuclearApi {
//   private ipc: IpcMain;
//   private status: MediaMetadata;
//   private logger: Logger;
//   private window: Window;

//   constructor(
//     @inject($ipc) ipc: IpcMain,
//     @inject($systemApiLogger) logger: Logger,
//     @inject(Window) window: Window
//   ) {
//     super();

//     this.ipc = ipc;
//     this.logger = logger;
//     this.window = window;
//   }

//   private getPlayingStatus(): Promise<NuclearStatus> {
//     return new Promise(resolve => {
//       this.window.send('playing-status');
//       this.ipc.once('playing-status', (evt: Event, data: NuclearStatus) => {
//         resolve(data);
//       });
//     });
//   }

//   private trackMapper(track: NuclearMeta): Partial<MediaMetadata> {
//     return {
//       album: '',
//       albumArt: track.thumbnail,
//       artist: track.artist,
//       title: track.name,
//       duration: track.stream.duration
//     };
//   }


//   @systemMediaEvent('play')
//   onPlay() {
//     this.window.send('play');
//   }

//   @systemMediaEvent('pause')
//   onPause() {
//     this.window.send('pause');
//   }

//   @systemMediaEvent('playpause')
//   onPlayPause() {
//     this.window.send('playpause');
//   }

//   @systemMediaEvent('next')
//   onNext() {
//     this.window.send('next');
//   }

//   @systemMediaEvent('previous')
//   onPrevious() {
//     this.window.send('previous');
//   }

//   @systemMediaEvent('seek')
//   onSeek(position: number) {
//     this.window.send('seek', position);
//   }


//   play() {
//     this.status.state = 'playing';
//     this.setMetaData(this.status);
//   }

//   pause() {
//     this.status.state = 'paused';
//     this.setMetaData(this.status);
//   }

//   sendMetadata(meta: NuclearMeta) {
//     this.setMetaData({
//       ...this.status,
//       ...this.trackMapper(meta)
//     });
//   }

//   async listen() {
//     this.startService();

//     const status = await this.getPlayingStatus();

//     this.status = {
//       album: '',
//       albumArt: '',
//       artist: '',
//       currentTime: 0,
//       duration: 0,
//       id: 0,
//       state: statusMapper[status.playbackStatus],
//       title: ''
//     };

//     this.setMetaData(this.status);

//     const meta: ControllerMeta<MediaEventName>[] = Reflect.getMetadata(SYSTEM_MEDIA_EVENT_KEY, MacMediaService.prototype);

//     meta.forEach(({ eventName, name }) => {

//       this.on(eventName, (data: any) => {
//         this.logger.logEvent({ direction: 'in', event: eventName, data });

//         const result = (this as any)[name](data);

//         if (result instanceof Promise) {
//           result.catch((err: Error) => {
//             this.logger.error(`error in event ${eventName} => ${err.message}`);
//           });
//         }
//       });
//     });
//   }
// }

// export default MacMediaService;
