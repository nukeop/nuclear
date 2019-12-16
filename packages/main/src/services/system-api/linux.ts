/* eslint-disable @typescript-eslint/no-explicit-any */
import { NuclearStatus, NuclearMeta, NuclearPlaylist } from '@nuclear/common';
import autobind from 'autobind-decorator';
import { app, IpcMain, Event } from 'electron';
import { inject } from 'inversify';
import _ from 'lodash';
import MprisService, { MprisPlaylist, MprisMeta, PlaybackStatus, LoopStatus } from 'mpris-service';

import NuclearApi from '../../utils/nuclear-api';
import { mprisController, mprisEvent, MPRIS_EVENT_KEY } from '../../utils/decorators';
import { ControllerMeta } from '../../utils/types';
import Config from '../config';
import Ipc from '../ipc';
import Logger, { systemApiLogger } from '../logger';
import Store from '../store';
import Window from '../window';

const statusMapper: Record<string, PlaybackStatus> = {
  PLAYING: MprisService.PLAYBACK_STATUS_PLAYING,
  PAUSED: MprisService.PLAYBACK_STATUS_PAUSED
};

const loopStatusMapper: Record<string, LoopStatus> = {
  true: MprisService.LOOP_STATUS_PLAYLIST,
  false: MprisService.LOOP_STATUS_NONE
};

/**
 * Wrapper around mpris-service
 * Bridge between the app and any Mpris client
 * 
 * @see {@link https://specifications.freedesktop.org/mpris-spec/latest/}
 * @see {@link https://github.com/dbusjs/mpris-service}
 * @see {@link https://extensions.gnome.org/extension/1379/mpris-indicator-button/}
 * @see {@link https://github.com/altdesktop/playerctl}
 */

@mprisController() 
class LinuxMediaService extends MprisService implements NuclearApi {
  tracks: MprisMeta[];
  rendererWindow: Event['sender'];

  constructor(
    @inject(Config) config: Config,
    @inject(Ipc) private ipc: IpcMain,
    @inject(systemApiLogger) private logger: Logger,
    @inject(Store) private store: Store,
    @inject(Window) private window: Window
  ) {
    super({
      name: config.title.replace(/ /g, '_'),
      identity: config.title,
      supportedMimeTypes: config.supportedFormats.map(format => `audio/${format}`),
      supportedUriSchemes: ['file', 'uri'],
      supportedInterfaces: ['player', 'trackList', 'playlists']
    });

    this.tracks = [];
    const storedPlaylists = this.store.get('playlists');
    this.setPlaylists(storedPlaylists ? storedPlaylists.map(this.playlistMapper) : []);
  }

  private getPlayingStatus(): Promise<NuclearStatus> {
    return new Promise(resolve => {
      this.rendererWindow.send('playing-status');
      this.ipc.once('playing-status', (evt: Event, data: NuclearStatus) => {
        resolve(data);
      });
    });
  }

  @autobind
  private trackMapper(track: NuclearMeta, index = 0): MprisMeta {
    return {
      id: track.uuid,
      'mpris:trackid': this.objectPath(`track/${index}`),
      'mpris:artUrl': track.thumbnail,
      'xesam:title': track.name,
      'xesam:artist': [track.artist]
      // 'mpris:length': this.getDuration(track.streams),
      // 'xesam:album': '21'
    };
  }

  @autobind
  private playlistMapper(playlist: NuclearPlaylist, index = 0): MprisPlaylist {
    return {
      Id: this.objectPath(`playlist/${index}`),
      Name: playlist.name,
      Icon: playlist.tracks[0].thumbnail
    };
  }

  @mprisEvent('activatePlaylist')
  onActivatePlaylist(playlistId: string) {
    this.setActivePlaylist(playlistId);
    this.rendererWindow.send('activate-playlist', this.playlists[this.getPlaylistIndex(playlistId)].Name);
  }

  @mprisEvent('raise')
  onRaise() {
    this.window.focus();
  }

  @mprisEvent('quit')
  onQuit() {
    app.quit();
  }

  @mprisEvent('shuffle')
  onShuffle() {
    this.shuffle = !this.shuffle;
    this.rendererWindow.send('settings', { shuffleQueue: this.shuffle });
  }

  @mprisEvent('loopStatus')
  onLoop() {
    this.loopStatus = this.loopStatus === MprisService.LOOP_STATUS_PLAYLIST
      ? MprisService.LOOP_STATUS_NONE
      : MprisService.LOOP_STATUS_PLAYLIST;
  
    this.rendererWindow.send('settings', { loopAfterQueueEnd: this.loopStatus === MprisService.LOOP_STATUS_PLAYLIST });
  }

  @mprisEvent('play')
  onPlay() {
    this.playbackStatus = MprisService.PLAYBACK_STATUS_PLAYING;
    this.rendererWindow.send('play');
  }

  @mprisEvent('pause')
  onPause() {
    this.playbackStatus = MprisService.PLAYBACK_STATUS_PAUSED;
    this.rendererWindow.send('pause');
  }

  @mprisEvent('stop')
  onStop() {
    this.playbackStatus = MprisService.PLAYBACK_STATUS_STOPED;
    this.rendererWindow.send('stop');
  }

  @mprisEvent('playpause')
  onPlayPause() {
    this.playbackStatus = this.playbackStatus === MprisService.PLAYBACK_STATUS_PLAYING
      ? MprisService.PLAYBACK_STATUS_PAUSED
      : MprisService.PLAYBACK_STATUS_STOPED;
    
    this.rendererWindow.send('playpause');
  }

  @mprisEvent('volume')
  onVolume(data: number) {
    this.volume = data;
    this.rendererWindow.send('volume', data * 100);
  }

  @mprisEvent('next')
  onNext() {
    this.rendererWindow.send('next');
  }

  @mprisEvent('previous')
  onPrevious() {
    this.rendererWindow.send('previous');
  }

  @mprisEvent('goTo')
  onSelectTrack(trackId: string) {
    this.rendererWindow.send('select-track', this.getTrackIndex(trackId));
  }

  setMetadata(track: NuclearMeta) {
    if (track.streams) {
      this.metadata = this.trackMapper(track);
    }
  }

  addTrack(track: NuclearMeta) {
    this.tracks = [
      ...this.tracks,
      this.trackMapper(track, this.tracks.length)
    ];
  }

  removeTrack(uuid: string) {
    this.tracks = this.tracks.filter((track) => uuid !== track.id);
  }

  play() {
    this.playbackStatus = MprisService.PLAYBACK_STATUS_PLAYING;
  }

  setVolume(volume: number) {
    this.volume = volume / 100;
  }

  pause() {
    this.playbackStatus = MprisService.PLAYBACK_STATUS_PAUSED;
  }

  setLoopStatus(data: boolean) {
    this.loopStatus = loopStatusMapper[data.toString()];
  }

  async listen() {
    const status = await this.getPlayingStatus();

    this.canControl = true;
    this.canEditTracks = true;
    this.playbackStatus = statusMapper[status.playbackStatus];
    this.volume = status.volume / 100;
    this.shuffle = status.shuffleQueue;
    this.loopStatus =loopStatusMapper[status.loopAfterQueueEnd.toString()];

    const meta: ControllerMeta[] = Reflect.getMetadata(MPRIS_EVENT_KEY, LinuxMediaService.prototype);

    meta.forEach(({ eventName, name }) => {

      this.on(eventName, (event: Event, data: any) => {
        this.logger.log(`incomming event => ${eventName}`);

        const result = (this as any)[name](event, data);

        if (result instanceof Promise) {
          result.catch((err: Error) => {
            this.logger.error(`error in event ${eventName} => ${err.message}`);
          });
        }
      });
    });
  }
}

export default LinuxMediaService;
