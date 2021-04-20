import { v4 } from 'uuid';

import Album from './Album';
import Track from './Track';
import {
  SearchResultsArtist,
  SearchResultsSource
} from '../plugins/plugins.types';

const artistQuantifierRegex = /\s\([0-9]*\)$/;
export const cleanName = name => name && name.replace(artistQuantifierRegex, '');

export default class Artist {
  uuid: string;
  ids?: {
    [K in SearchResultsSource]?: string
  };
  name?: string;
  description?: string;
  tags?: string[];
  onTour?: boolean;

  coverImage?: string;
  thumbnail?: string;
  images?: string[];

  albums?: Album[];
  topTracks?: Track[];
  similarArtists?: Artist[];

  constructor(data: Partial<Artist> = {}) {
    this.uuid = v4();
    this.ids = data.ids || {};
    this.name = data.name;
    this.description = data.description;
    this.tags = data.tags;
    this.onTour = data.onTour;

    this.coverImage = data.coverImage;
    this.thumbnail = data.thumbnail;
    this.images = data.images;

    this.albums = data.albums;
    this.topTracks = data.topTracks;
    this.similarArtists = data.similarArtists;

    this.cleanName();
  }

  cleanName(): void {
    this.name = cleanName(this.name);
  }

  addSearchResultData(data: SearchResultsArtist): void {
    this.ids = { ...this.ids, [data.source]: data.id };
    this.name = data.name;
    this.coverImage = data.coverImage;
    this.thumbnail = data.thumb;
    this.cleanName();
  }

  static fromSearchResultData(data: SearchResultsArtist): Artist {
    const artist = new Artist();
    artist.addSearchResultData(data);
    artist.cleanName();
    return artist;
  }
}
