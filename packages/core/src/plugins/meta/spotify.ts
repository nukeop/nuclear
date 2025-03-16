import { SpotifyArtist, SpotifyClientProvider, SpotifySimplifiedAlbum, SpotifyTrack, getImageSet } from '../../rest/Spotify';
import Track from '../../structs/Track';
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
    const { thumb, coverImage } = getImageSet(spotifyArtist.images);
    return {
      id: spotifyArtist.id,
      coverImage,
      thumb,
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
    const { thumb, coverImage } = getImageSet(spotifyRelease.images);
    return {
      id: spotifyRelease.id,
      thumb,
      coverImage,
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
    const { thumb } = getImageSet(spotifyTrack.album.images);
    return {
      id: spotifyTrack.id,
      title: spotifyTrack.name,
      artist: spotifyTrack.artists[0].name,
      discNumber: spotifyTrack.disc_number,
      source: SearchResultsSource.Spotify,
      thumb
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
    const { thumb, coverImage } = getImageSet(spotifyArtist.images);

    return {
      id: spotifyArtist.id,
      name: spotifyArtist.name,
      coverImage,
      thumb,
      source: SearchResultsSource.Spotify,
      images: spotifyArtist.images.map(image => image.url),
      topTracks: [],
      similar: []
    };
  }

  mapSpotifyTopTrack(spotifyTrack: SpotifyTrack): ArtistTopTrack {
    const { thumb } = getImageSet(spotifyTrack.album.images);
    return {
      artist: {name: spotifyTrack.artists[0].name},
      title: spotifyTrack.name,
      thumb,
      playcount: spotifyTrack.popularity,
      listeners: spotifyTrack.popularity
    };
  }

  mapSpotifySimilarArtist(spotifyArtist: SpotifyArtist): SimilarArtist {
    const { thumb } = getImageSet(spotifyArtist.images);
    return {
      name: spotifyArtist.name,
      thumbnail: thumb
    };
  }

  async fetchArtistDetailsByName(artistName: string): Promise<ArtistDetails> {
    const client = await SpotifyClientProvider.get();
    const result = await client.getTopArtist(artistName);
    const topTracks = await client.getArtistTopTracks(result.id);
    const similarArtists = await client.getSimilarArtists(result.id);

    return {
      ...this.mapSpotifyArtistDetails(result),
      topTracks: topTracks.map(this.mapSpotifyTopTrack),
      similar: similarArtists.map(this.mapSpotifySimilarArtist)
    };
  }

  async fetchArtistAlbums(artistId: string): Promise<SearchResultsAlbum[]> {
    const client = await SpotifyClientProvider.get();
    const results = await client.getArtistsAlbums(artistId);

    return results.map(this.mapSpotifyRelease);
  }

  async fetchAlbumDetails(albumId: string, albumType: 'master' | 'release', resourceUrl?: string): Promise<AlbumDetails> {
    const client = await SpotifyClientProvider.get();
    const result = await client.getAlbum(albumId);

    const { thumb, coverImage } = getImageSet(result.images);

    return {
      id: result.id,
      artist: result.artists[0].name,
      title: result.name,
      coverImage,
      thumb,
      images: result.images.map(image => image.url),
      genres: result.genres,
      year: result.release_date,
      tracklist: result.tracks.items.map(track => new Track({
        title: track.name,
        artist: result.artists[0].name,
        duration: track.duration_ms/1000,
        discNumber: track.disc_number,
        position: track.track_number,
        thumbnail: thumb
      }))
    };
  }

  async fetchAlbumDetailsByName(albumName: string, albumType?: 'master' | 'release', artist?: string): Promise<AlbumDetails> {
    const client = await SpotifyClientProvider.get();
    const result = await client.getTopAlbum(`${albumName} ${artist}`);

    return this.fetchAlbumDetails(result.id, albumType);
  }

}

