import Soundcloud from 'soundcloud.ts';
import MetaProvider from '../metaProvider';
import { AlbumDetails, ArtistDetails, SearchResultsAlbum, SearchResultsArtist, SearchResultsSource, SearchResultsTrack } from '../plugins.types';

export class SoundcloudMetaProvider extends MetaProvider {
    soundcloud: Soundcloud;
    constructor() {
      super();
      this.name = 'Soundcloud Meta Provider';
      this.sourceName = 'Soundcloud Meta Provider';
      this.description = 'Metadata provider that uses Soundcloud as a source.';
      this.searchName = 'Soundcloud';
      this.image = null;
      this.soundcloud = new Soundcloud();
    }

    async searchForArtists(query: string): Promise<Array<SearchResultsArtist>> {
      const searchResults = await this.soundcloud.users.search({q: query});
      return searchResults.collection.map((result) => ({
        id: result.id.toString(),
        coverImage: result.avatar_url,
        thumb: result.avatar_url,
        name: result.username,
        image: result.avatar_url,
        url: result.permalink_url,
        resourceUrl: result.permalink_url,
        source: SearchResultsSource.Soundcloud
      }));
    }

    async searchForReleases(query: string): Promise<Array<SearchResultsAlbum>> {
      const searchResults = await this.soundcloud.tracks.search({q: query});
      return [];
    }

    async searchForTracks(query: string): Promise<Array<SearchResultsTrack>> {
      const searchResults = await this.soundcloud.tracks.search({q: query});
      return searchResults.collection.map((result) => ({
        id: result.id.toString(),
        title: result.title,
        artist: result.user.username,
        source: SearchResultsSource.Soundcloud
      }));
    }

    async fetchArtistAlbums(artistId: string): Promise<Array<SearchResultsAlbum>> {
      return [];
    }

    async fetchArtistDetailsByName(artistName: string): Promise<ArtistDetails> {
        
      const searchResults = await this.soundcloud.users.search({ q: artistName });
      const artist = searchResults.collection[0];
      if (artist) {
        return this.fetchArtistDetails(artist.id.toString());
      }
      throw new Error('Artist not found');
    }

    async fetchArtistDetails(artistId: string): Promise<ArtistDetails> {
      const user = await this.soundcloud.users.get(artistId);
      const topTracks = await this.soundcloud.users.tracks(user.id);

      if (user) {
        return {
          id: user.id.toString(),
          name: user.username,
          description: user.description,
          coverImage: user.avatar_url,
          similar: [],
          topTracks: topTracks.map((track) => ({
            artist: { name: track.user.username },
            title: track.title,
            playcount: track.playback_count,
            listeners: track.likes_count
          })),
          source: SearchResultsSource.Soundcloud
        };
      }
    }

    async fetchAlbumDetails(albumId: string, albumType: ('master' | 'release'), resourceUrl?: string): Promise<AlbumDetails> {
      return null;
    }

    async fetchAlbumDetailsByName(albumName: string, albumType?: ('master' | 'release'), artist?: string): Promise<AlbumDetails> {
      return null;
    }

    searchAll(query: string): Promise<{ artists: Array<SearchResultsArtist>; releases: Array<SearchResultsAlbum>; tracks: Array<SearchResultsTrack>; }> {
      throw new Error('Method not implemented.');
    }
}
