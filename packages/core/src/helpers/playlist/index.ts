import _ from 'lodash';
import { v4 } from 'uuid';
import { Playlist, PlaylistTrack, PlaylistTrackStream } from './types';

const formatPlaylistForStorage = (name: string, tracks: Array<any>, id: string = v4(), streamSource: string = null): Playlist => {
  return {
    name,
    id,
    tracks: !_.isEmpty(tracks) ? formatTrackList(tracks, streamSource) : []
  };
};

const formatTrackList = (tracks, streamSource: string = null): PlaylistTrack[] => (tracks) ?
  tracks.map(track => extractTrackData(track, streamSource)) : [];

const extractTrackData = (track, streamSource: string = null): PlaylistTrack => {
  const trackStreams = track.streams || streamSource ? [{ source: streamSource, id: track.id }] : [];

  return track && (track.name || track.title) && (!track.type || track.type === 'track') ?
    {
      artist: track.artist,
      name: track.name || track.title,
      album: track.album,
      thumbnail: track.thumbnail,
      duration: track.duration,
      uuid: track.uuid,
      stream: extractStreamData(trackStreams)
    } :
    null;
};

const extractStreamData = (stream): PlaylistTrackStream => {
  return stream && stream.source && stream.id ?
    {
      source: stream.source,
      id: stream.id,
      duration: stream.duration,
      title: stream.title,
      thumbnail: stream.thumbnail
    } :
    null;
};

export default {
  formatPlaylistForStorage,
  formatTrackList,
  extractTrackData,
  extractStreamData
};
