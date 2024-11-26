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
  name?: string;
  duration: string | number;

  position?: string | number;
  discNumber?: string | number;
  playcount?: string | number;
  thumbnail?: string;
  extraArtists?: string[];
  type?: string;
  local?: boolean;

  constructor(data: PartialExcept<Track, 'artist' | 'title'> = {
    artist: '',
    title: ''
  }) {
    this.uuid = v4();
    this.ids = data.ids || {};
    this.artist = data.artist;
    this.title = data.title;
    this.name = data.title;
    this.duration = data.duration;
    this.position = data.position;
    this.thumbnail = data.thumbnail;
    this.discNumber = data.discNumber;
  }

  addSearchResultData(data: SearchResultsTrack): void {
    this.ids = { ...this.ids, [data.source]: data.id };
    this.artist = data.artist;
    this.title = data.title;
    this.name = data.title;
    this.discNumber = data.discNumber;
  }

  static fromSearchResultData(data: SearchResultsTrack): Track {
    const track = new Track();
    track.addSearchResultData(data);
    return track;
  }
}


