import {
  SearchResultsAlbum,
  SearchResultsSource
} from '../plugins/plugins.types';

export default class Album {
  uuid: string;
  ids?: {
    [K in SearchResultsSource]?: string
  };
  artist: string;
  title: string;
  genres: string[];
}