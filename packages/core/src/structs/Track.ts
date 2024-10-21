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
  artists: string[];
  title: string;
  name?: string;
  duration: string | number;
  
  position?: string | number;
  playcount?: string | number;
  thumbnail?: string;
  type?: string;
  local?: boolean;

  constructor(data: PartialExcept<Track, 'artists' | 'title'> = {
    artists: [''],
    title: ''
  }) {
    this.uuid = v4();
    this.ids = data.ids || {};
    this.artists = data.artists;
    this.title = data.title;
    this.name = data.title;
    this.duration = data.duration;
    this.position = data.position;
    this.thumbnail = data.thumbnail;
  }

  addSearchResultData(data: SearchResultsTrack): void {
    this.ids = { ...this.ids, [data.source]: data.id };
    this.artists = data.artists;
    this.title = data.title;
    this.name = data.title;
  }

  static fromSearchResultData(data: SearchResultsTrack): Track {
    const track = new Track();
    track.addSearchResultData(data);
    return track;
  }
}


