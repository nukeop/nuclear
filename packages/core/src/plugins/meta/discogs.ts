import MetaProvider from '../metaProvider';
import * as Discogs from '../../rest/Discogs';
import {
  SearchResultsArtist,
  SearchResultsAlbum,
  SearchResultsTrack
} from '../plugins.types';

const SEARCH_TYPE = Object.freeze({
  ARTIST: 'artist',
  MASTER: 'master',
  RELEASE: 'release'
});

class DiscogsMetaProvider extends MetaProvider {
  constructor() {
    super();
    this.name = 'Discogs Meta Provider';
    this.searchName = 'Discogs';
    this.sourceName = 'Discogs Metadata Provider';
    this.description = 'Metadata provider that uses Discogs as a source.';
    this.image = null;
  }

  searchForArtists(query: string): Promise<Array<SearchResultsArtist>> {
    return Discogs.search(query, SEARCH_TYPE.ARTIST)
      .then(response => response.json())
      .then(json => json.results);
  }

  searchForReleases(query: string): Promise<Array<SearchResultsAlbum>> {
    return Discogs.search(query, SEARCH_TYPE.MASTER)
      .then(response => response.json())
      .then(json => json.results);
  }

  searchForTracks(query: string): Promise<Array<SearchResultsTrack>> {
    return Promise.resolve([]);
  }

  searchAll(query): Promise<{
    artists: Array<SearchResultsArtist>;
    releases: Array<SearchResultsAlbum>;
    tracks: Array<SearchResultsTrack>;
  }> {
    return Discogs.search(query)
      .then(response => response.json())
      .then(json => json.results);
  }
}

export default DiscogsMetaProvider;
