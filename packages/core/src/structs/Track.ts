import {
  SearchResultsSource
} from '../plugins/plugins.types';

export default class Track {
  uuid: string;
  ids?: {
    [K in SearchResultsSource]?: string
  };
  artist: string;
  title: string;
}