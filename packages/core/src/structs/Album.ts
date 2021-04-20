import { v4 } from 'uuid';

import {
  SearchResultsAlbum,
  SearchResultsSource
} from '../plugins/plugins.types';

import Track from './Track';

export default class Album {
  uuid: string;
  ids?: {
    [K in SearchResultsSource]?: string
  };
  artist: string;
  title: string;
  genres: string[];

  coverImage?: string;
  thumbnail?: string;

  tracklist?: Track[];

  constructor(data: Partial<Album> = {}) {
    this.uuid = v4();

    this.ids = data.ids || {};
    this.artist = data.artist;
    this.title = data.title;
    this.genres = data.genres || [];
    this.coverImage = data.coverImage;
    this.thumbnail = data.thumbnail;
  }

  addSearchResultData(data: SearchResultsAlbum): void {
    this.ids = { ...this.ids, [data.source]: data.id };
    this.artist = data.artist;
    this.title = data.title;
    this.coverImage = data.coverImage;
    this.thumbnail = data.thumb;
  }

  static fromSearchResultData(data: SearchResultsAlbum): Album {
    const album = new Album();
    album.addSearchResultData(data);
    return album;
  }
}
