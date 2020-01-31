import _ from 'lodash';
import MetaProvider from '../metaProvider';
import {
  SearchResultsArtist,
  SearchResultsAlbum,
  SearchResultsTrack
} from '../plugins.types';
import * as Bandcap from '../../rest/Bandcamp';
import { Bandcamp } from '../../rest';

class BandcampMetaProvider extends MetaProvider {
  constructor() {
    super();
    this.name = 'Bandcamp Meta Provider';
    this.sourceName = 'Bandcamp Meta Provider';
    this.description = 'Metadata provider that uses Bandcamp as a source.';
    this.searchName = 'Bandcamp';
    this.image = null;
  }

  searchForArtists(query): Promise<Array<SearchResultsArtist>> {
    return Bandcamp.search(query)
      .then(results => _(results).filter({ type: 'artist' }).map(artist => ({
        id: artist.url,
        coverImage: artist.imageUrl,
        thumb: artist.imageUrl,
        title: artist.name
      }))
        .value())
  }

  searchForReleases(query): Promise<Array<SearchResultsAlbum>> {
    return Bandcamp.search(query)
      .then(results => _(results).filter({ type: 'album' }).map(album => ({
        id: album.url,
        coverImage: album.imageUrl,
        thumb: album.imageUrl,
        title: album.name,
        artist: album.artist
      }))
        .value())
  }

  searchForTracks(query): Promise<SearchResultsTrack[]> {
    throw new Error("Method not implemented.");
  }

  searchAll(query): Promise<{
    artists: Array<SearchResultsArtist>;
    releases: Array<SearchResultsAlbum>;
    tracks: Array<SearchResultsTrack>;
  }> {
    throw new Error("Method not implemented.");
  }
}

export default BandcampMetaProvider;