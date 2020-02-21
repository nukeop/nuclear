import _ from 'lodash';
import MetaProvider from '../metaProvider';
import {
  SearchResultsArtist,
  SearchResultsAlbum,
  SearchResultsTrack,
  ArtistDetails,
  AlbumDetails
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
  
  searchForArtists(query: string): Promise<Array<SearchResultsArtist>> {
    return Bandcamp.search(query)
    .then(results => _(results).filter({ type: 'artist' }).map(artist => ({
      id: artist.url,
      coverImage: artist.imageUrl,
      thumb: artist.imageUrl,
      title: artist.name
    }))
    .value());
  }
  
  searchForReleases(query: string): Promise<Array<SearchResultsAlbum>> {
    return Bandcamp.search(query)
    .then(results => _(results).filter({ type: 'album' }).map(album => ({
      id: album.url,
      coverImage: album.imageUrl,
      thumb: album.imageUrl,
      title: album.name,
      artist: album.artist
    }))
    .value());
  }
  
  searchForTracks(query: string): Promise<SearchResultsTrack[]> {
    throw new Error('Method not implemented.');
  }
  
  searchAll(query: string): Promise<{
    artists: Array<SearchResultsArtist>;
    releases: Array<SearchResultsAlbum>;
    tracks: Array<SearchResultsTrack>;
  }> {
    throw new Error('Method not implemented.');
  }
  
  fetchArtistDetails(artistId: string): Promise<ArtistDetails> {
    throw new Error('Method not implemented.');
  }
  fetchArtistDetailsByName(artistName: string): Promise<ArtistDetails> {
    throw new Error('Method not implemented.');
  }
  fetchArtistAlbums(artistId: string): Promise<SearchResultsAlbum[]> {
    throw new Error('Method not implemented.');
  }
  fetchAlbumDetails(albumId: string, resourceUrl: string): Promise<AlbumDetails> {
    throw new Error("Method not implemented.");
  }
  fetchAlbumDetailsByName(albumName: string): Promise<AlbumDetails> {
    throw new Error('Method not implemented.');
  }
}

export default BandcampMetaProvider;
