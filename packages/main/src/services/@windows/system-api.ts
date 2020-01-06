/* eslint-disable @typescript-eslint/no-empty-function */
import NuclearApi from '../../interfaces/nuclear-api';
import { injectable } from 'inversify';

@injectable()
class WindowsMediaService implements NuclearApi {
  onPause() {}
  onPlay() {}
  pause() {}
  play() {}
  listen() {}
}

export default WindowsMediaService;


// import { MediaPlaybackStatus, MediaPlaybackType, SystemMediaTransportControlsButton } from '@nodert-win10/windows.media';
// import { BackgroundMediaPlayer } from '@nodert-win10/windows.media.playback';
// import { RandomAccessStreamReference } from '@nodert-win10/windows.storage.streams';
// import { Uri } from '@nodert-win10/windows.foundation';
// import { NuclearStatus, PlaybackStatus, NuclearMeta } from '@nuclear/core';
// import { Event, IpcMain } from 'electron';
// import { inject, injectable } from 'inversify';

// import Ipc from '../ipc';
// import Config from '../config';
// import NuclearApi from '../../interfaces/nuclear-api';
// import Window from '../window';

// @injectable()
// class WindowsMediaService implements NuclearApi {
//   private controls: any;

//   constructor(
//     @inject(Config) private config: Config,
//     @inject(Ipc) private ipc: IpcMain,
//     @inject(Window) private window: Window
//   ) {}

//   private getPlayingStatus(): Promise<NuclearStatus> {
//     return new Promise(resolve => {
//       this.window.send('playing-status');
//       this.ipc.once('playing-status', (evt: Event, data: NuclearStatus) => {
//         resolve(data);
//       });
//     });
//   }

//   onPlay() {
//     this.window.send('play');
//   }
  
//   onPause() {
//     this.window.send('pause');
//   }

//   onStop() {
//     this.window.send('stop');
//   }

//   onNext() {
//     this.window.send('next');
//   }

//   onPrevious() {
//     this.window.send('previous');
//   }

//   play() {
//     this.controls.playbackStatus = MediaPlaybackStatus.playing;
//   }
  
//   pause() {
//     this.controls.playbackStatus = MediaPlaybackStatus.paused;
//   }

//   sendMetadata(track: NuclearMeta) {
//     this.controls.displayUpdater.musicProperties.artist = track.artist;
//     this.controls.displayUpdater.musicProperties.title = track.name;

//     // this.controls.displayUpdater.musicProperties.albumTitle = track.genre || '';
//     this.controls.displayUpdater.thumbnail = track.thumbnail ? RandomAccessStreamReference.createFromUri(new Uri(track.thumbnail)) : '';

//     this.controls.displayUpdater.update();
//   }

//   listen() {
//     this.controls = BackgroundMediaPlayer.current.systemMediaTransportControls;

//     this.controls.isChannelDownEnabled = false;
//     this.controls.isChannelUpEnabled = false;
//     this.controls.isFastForwardEnabled = false;
//     this.controls.isNextEnabled = true;
//     this.controls.isPauseEnabled = true;
//     this.controls.isPlayEnabled = true;
//     this.controls.isPreviousEnabled = true;
//     this.controls.isRecordEnabled = false;
//     this.controls.isRewindEnabled = false;
//     this.controls.isStopEnabled = true;
//     this.controls.playbackStatus = MediaPlaybackStatus.closed;
//     this.controls.displayUpdater.type = MediaPlaybackType.music;

//     this.controls.displayUpdater.musicProperties.title = this.config.title;
//     this.controls.displayUpdater.musicProperties.artist = 'No track';
//     this.controls.displayUpdater.update();

//     this.controls.on('buttonpressed', (_sender: any, eventArgs: any) => {
//       switch (eventArgs.button) {
//         case SystemMediaTransportControlsButton.play:
//           this.onPlay()
//           break;
//         case SystemMediaTransportControlsButton.pause:
//           this.onPause();
//           break;
//         case SystemMediaTransportControlsButton.stop:
//           this.onStop();
//           break;
//         case SystemMediaTransportControlsButton.next:
//           this.onNext()
//           break;
//         case SystemMediaTransportControlsButton.previous:
//           this.onPrevious()
//           break;
//         default:
//           break;
//       }
//     });
//   }
// }

// export default WindowsMediaService;
