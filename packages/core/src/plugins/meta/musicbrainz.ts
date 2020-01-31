import MetaProvider from '../metaProvider';
import {
  artistSearch,
  releaseSearch,
  trackSearch,
  getCoverForRelease
} from '../../rest/Musicbrainz';
import {
  SearchResultsArtist,
  SearchResultsAlbum,
  SearchResultsTrack
} from '../plugins.types';

class MusicbrainzMetaProvider extends MetaProvider {
  constructor() {
    super();
    this.name = 'Musicbrainz Meta Provider';
    this.sourceName = 'Musicbrainz Meta Provider';
    this.description = 'Metadata provider that uses Musicbrainz as a source.';
    this.searchName = 'Musicbrainz';
    this.image = null;
  }

  searchForArtists(query: string): Promise<Array<SearchResultsArtist>> {
    return artistSearch(query)
      .then(response => response.artists.map(artist => ({
        id: artist.id,
        coverImage: '',
        thumb: '',
        title: artist.name
      })));
  }

  async searchForReleases(query): Promise<Array<SearchResultsAlbum>> {
    const releaseGroups = await releaseSearch(query)
      .then(response => response['release-groups']);

    return Promise.all(releaseGroups.map(
      async group => {
        const cover = await getCoverForRelease(group.id);

        return {
          id: group.id,
          coverImage: cover.ok ? cover.url : null,
          thumb: cover.ok ? cover.url : null,
          title: group.title,
          artist: group.artist
        };
      }
    ));
  }

  searchForTracks(query: string): Promise<Array<SearchResultsTrack>> {
    return trackSearch(query)
      .then(response => response.tracks.map(track => ({
        id: track.id
      })));
  }

  async searchAll(query): Promise<{
    artists: Array<SearchResultsArtist>;
    releases: Array<SearchResultsAlbum>;
    tracks: Array<SearchResultsTrack>;
  }> {
    const artists = await this.searchForArtists(query);
    const releases = await this.searchForReleases(query);
    const tracks = await this.searchForTracks(query);
    return Promise.resolve({ artists, releases, tracks });
  }
}


export default MusicbrainzMetaProvider;
