import { v4 } from 'uuid';
import {Playlist, PlaylistTrack, PlaylistTrackStream} from './types';

const formatPlaylistForStorage = (name: string, tracks: Array<any>, id: string = v4()): Playlist => {
  return {
    name,
    id,
    tracks: formatTrackList(tracks)
  };
};

const formatTrackList = (tracks): PlaylistTrack[] => {
  const formattedTrack: PlaylistTrack[] = [];
  if (tracks) {
    tracks.forEach(track => {
      const formattedData = extractTrackData(track);
      if (formattedData) {
        formattedTrack.push(formattedData);
      }
    });
  }
  
  return formattedTrack;
};

const extractTrackData = (track): PlaylistTrack => {
  return track && (track.name || track.title) && (!track.type || track.type === 'track') ? 
    {
      artist: track.artist,
      name: track.name,
      album: track.album,
      thumbnail: track.thumbnail,
      duration: track.duration,
      uuid: track.uuid, 
      streams: formatTrackStreamList(track.streams)
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
