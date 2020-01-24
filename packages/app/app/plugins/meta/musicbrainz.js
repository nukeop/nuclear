import MetaProvider from '../metaProvider';
import {
  artistSearch,
  releaseSearch,
  trackSearch,
  getCoverForRelease
} from '../../rest/Musicbrainz';

class MusicbrainzMetaProvider extends MetaProvider {
  constructor() {
    super();
    this.name = 'Musicbrainz Meta Provider';
    this.sourceName = 'Musicbrainz Meta Provider';
    this.description = 'Metadata provider that uses Musicbrainz as a source.';
    this.searchName = 'Musicbrainz';
  }

  searchForArtists(query) {
    return artistSearch(query)
      .then(response => response.artists.map(artist => ({
        id: artist.id,
        coverImage: '',
        thumb: '',
        title: artist.name
      })));
  }

  async searchForReleases(query) {
    const releaseGroups = await releaseSearch(query)
      .then(response => response['release-groups']);

    return Promise.all(releaseGroups.map(
      async group => {
        const cover = await getCoverForRelease(group.id);

        return {
          id: group.id,
          coverImage: cover.ok ? cover.url : null,
          thumb: cover.ok ? cover.url : null,
          title: group.title
        };
      }
    ));
  }

  searchAll(query) {
    return new Promise();
  }
}


export default MusicbrainzMetaProvider;
