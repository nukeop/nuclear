import { v4 } from 'uuid';
import { Playlist, PlaylistTrack, PlaylistTrackStream } from './types';

const formatPlaylistForStorage = (name: string, tracks: Array<any>, id: string = v4(), streamSource: string = null): Playlist => {
  return {
    name,
    id,
    tracks: formatTrackList(tracks, streamSource)
  };
};

const formatTrackList = (tracks, streamSource: string = null): PlaylistTrack[] => {
  const formattedTrack: PlaylistTrack[] = [];
  if (tracks) {
    tracks.forEach(track => {
      const formattedData = extractTrackData(track, streamSource);
      if (formattedData) {
        formattedTrack.push(formattedData);
      }
    });
  }

  return formattedTrack;
};

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
      streams: formatTrackStreamList(trackStreams)
    } :
    null;
};

const formatTrackStreamList = (streams): PlaylistTrackStream[] => {
  const formattedStreams: PlaylistTrackStream[] = [];
  if (streams) {
    streams.forEach(stream => {
      const formattedData = extractStreamData(stream);
      if (formattedData) {
        formattedStreams.push(formattedData);
      }
    });
  }

  return formattedStreams;
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
  formatTrackStreamList,
  extractStreamData
};
