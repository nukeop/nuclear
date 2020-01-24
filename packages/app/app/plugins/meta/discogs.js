import MetaProvider from '../metaProvider';
import discogs from '../../rest/Discogs';

const SEARCH_TYPE = Object.freeze({
  ARTIST: 'artist',
  MASTER: 'master',
  RELEASE: 'release'
});

class DiscogsMetaProvider extends MetaProvider {
  constructor() {
    super();
    this.name = 'Discogs Meta Provider';
    this.sourceName = 'Discogs Metadata Provider';
    this.description = 'Metadata provider that uses Discogs as a source.';
    this.searchName = 'Discogs';
    this.image = null;
  }

  searchForArtists(query) {
    return discogs.search(query, SEARCH_TYPE.ARTIST)
      .then(response => response.json())
      .then(json => json.results);
  }

  searchForReleases(query) {
    return discogs.search(query, SEARCH_TYPE.MASTER)
      .then(response => response.json())
      .then(json => json.results);
  }

  searchAll(query) {
    return discogs.search(query)
      .then(response => response.json())
      .then(json => json.results);
  }
}

export default DiscogsMetaProvider;
