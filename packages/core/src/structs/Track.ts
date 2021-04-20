import { v4 } from 'uuid';

import {
  SearchResultsSource,
  SearchResultsTrack
} from '../plugins/plugins.types';
import { PartialExcept } from '../types';

export default class Track {
  uuid: string;
  ids?: {
    [K in SearchResultsSource]?: string
  };
  artist: string;
  title: string;
  duration: string | number;
  
  position?: string | number;
  thumbnail?: string;
  thumb?: string;
  extraArtists?: string[];
  type?: string;

  constructor(data: PartialExcept<Track, 'artist' | 'title'> = {
    artist: '',
    title: ''
  }) {
    this.uuid = v4();
    this.ids = data.ids || {};
    this.artist = data.artist;
    this.title = data.title;
    this.duration = data.duration;
    this.position = data.position;
    this.thumbnail = data.thumbnail;
  }

  addSearchResultData(data: SearchResultsTrack): void {
    this.ids = { ...this.ids, [data.source]: data.id };
    this.artist = data.artist;
    this.title = data.title;
  }

  static fromSearchResultData(data: SearchResultsTrack): Track {
    const track = new Track();
    track.addSearchResultData(data);
    return track;
  }
}


