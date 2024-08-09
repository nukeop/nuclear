import { SpotifyArtist, SpotifyClientProvider, SpotifySimplifiedAlbum, SpotifyTrack } from '../../rest/Spotify';
import MetaProvider from '../metaProvider';
import { SearchResultsArtist, SearchResultsAlbum, SearchResultsTrack, ArtistDetails, AlbumDetails, SearchResultsSource, ArtistTopTrack, SimilarArtist } from '../plugins.types';

export class SpotifyMetaProvider extends MetaProvider {
  constructor() {
    super();
    this.name = 'Spotify Meta Provider';
    this.searchName = 'Spotify';
    this.sourceName = 'Spotify Metadata Provider';
    this.description = 'Metadata provider that uses Spotify as a source.';
    this.image = null;
    this.isDefault = true;
  }
      
  async searchForArtists(query: string, limit=10): Promise<SearchResultsArtist[]> {
    const client = await SpotifyClientProvider.get();
    const results = await client.searchArtists(query, limit);

    return results.map(this.mapSpotifyArtist);
  }

  mapSpotifyArtist(spotifyArtist: SpotifyArtist): SearchResultsArtist {
    return {
      id: spotifyArtist.id,
      coverImage: spotifyArtist.images[0]?.url,
      thumb: spotifyArtist.images[0]?.url,
      name: spotifyArtist.name,
      source: SearchResultsSource.Spotify
    };
  }

  async searchForReleases(query: string): Promise<SearchResultsAlbum[]> {
    const client = await SpotifyClientProvider.get();
    const results = await client.searchReleases(query);

    return results.map(this.mapSpotifyRelease);
  }

  mapSpotifyRelease(spotifyRelease: SpotifySimplifiedAlbum): SearchResultsAlbum {
    return {
      id: spotifyRelease.id,
      thumb: spotifyRelease.images[0]?.url,
      coverImage: spotifyRelease.images[0]?.url,
      images: spotifyRelease.images.map(image => image.url),
      title: spotifyRelease.name,
      artist: spotifyRelease.artists[0].name,
      resourceUrl: spotifyRelease.href,
      year: spotifyRelease.release_date,
      source: SearchResultsSource.Spotify
    };
  }

  async searchForTracks(query: string): Promise<SearchResultsTrack[]> {
    const client = await SpotifyClientProvider.get();
    const results = await client.searchTracks(query);

    return results.map(this.mapSpotifyTrack);
  }

  mapSpotifyTrack(spotifyTrack: SpotifyTrack): SearchResultsTrack {
    return {
      id: spotifyTrack.id,
      title: spotifyTrack.name,
      artist: spotifyTrack.artists[0].name,
      source: SearchResultsSource.Spotify,
      thumb: spotifyTrack.album.images[0]?.url
    };
  }

  async searchAll(query: string): Promise<{ artists: SearchResultsArtist[]; releases: SearchResultsAlbum[]; tracks: SearchResultsTrack[]; }> {
    const client = await SpotifyClientProvider.get();
    const results = await client.searchAll(query);

    return {
      artists: results.artists.map(this.mapSpotifyArtist),
      releases: results.releases.map(this.mapSpotifyRelease),
      tracks: results.tracks.map(this.mapSpotifyTrack)
    };
  }

  async fetchArtistDetails(artistId: string): Promise<ArtistDetails> {
    const client = await SpotifyClientProvider.get();
    const result = await client.getArtistDetails(artistId);
    const topTracks = await client.getArtistTopTracks(artistId);
    const similarArtists = await client.getSimilarArtists(artistId);

    return {
      ...this.mapSpotifyArtistDetails(result),
      topTracks: topTracks.map(this.mapSpotifyTopTrack),
      similar: similarArtists.map(this.mapSpotifySimilarArtist)
    };
  }

  mapSpotifyArtistDetails(spotifyArtist: SpotifyArtist): ArtistDetails {
    const largestImage = spotifyArtist.images.reduce((prev, current) => {
      return (prev.height * prev.width) > (current.height * current.width) ? prev : current;
    });
    const thumbnail = spotifyArtist.images.find(image => image.height < 400 && image.width < 400);

    return {
      id: spotifyArtist.id,
      name: spotifyArtist.name,
      coverImage: largestImage?.url,
      thumb: thumbnail?.url,
      source: SearchResultsSource.Spotify,
      images: spotifyArtist.images.map(image => image.url),
      topTracks: [],
      similar: []
    };
  }

  mapSpotifyTopTrack(spotifyTrack: SpotifyTrack): ArtistTopTrack {
    return {
      artist: {name: spotifyTrack.artists[0].name},
      title: spotifyTrack.name,
      thumb: spotifyTrack.album.images[0]?.url,
      playcount: spotifyTrack.popularity,
      listeners: spotifyTrack.popularity
    };
  }

  mapSpotifySimilarArtist(spotifyArtist: SpotifyArtist): SimilarArtist {
    return {
      name: spotifyArtist.name,
      thumbnail: spotifyArtist.images[0]?.url
    };
  }

  fetchArtistDetailsByName(artistName: string): Promise<ArtistDetails> {
    throw new Error('');
  }

  async fetchArtistAlbums(artistId: string): Promise<SearchResultsAlbum[]> {
    const client = await SpotifyClientProvider.get();
    const results = await client.getArtistsAlbums(artistId);

    return results.map(this.mapSpotifyRelease);
  }

  fetchAlbumDetails(albumId: string, albumType: 'master' | 'release', resourceUrl?: string): Promise<AlbumDetails> {
    throw new Error('');
  }
  fetchAlbumDetailsByName(albumName: string, albumType?: 'master' | 'release', artist?: string): Promise<AlbumDetails> {
    throw new Error('');
  }
  
}
