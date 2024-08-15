import fetchMock from 'fetch-mock';

import { SpotifyArtist, SpotifyFullAlbum, SpotifyFullArtist, SpotifySimplifiedAlbum, SpotifyTrack } from '../src/rest/Spotify';

export class SpotifyMock {
  static withAccessToken(accessToken = 'my-spotify-token') {
    fetchMock.get('https://open.spotify.com/get_access_token?reason=transport&productType=web_player', 
      { accessToken });
  }
  
  static withSearchArtists(query: string, artists: Partial<SpotifyArtist>[], limit=10) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&decorate_restrictions=false&include_external=audio&limit=${limit}`, {
      artists: { items: artists } 
    });
  }
  
  static withGetTopArtist(query: string, artist: Partial<SpotifyArtist>) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&decorate_restrictions=false&best_match=true&include_external=audio&limit=1`, {
      best_match: { items: [artist] } 
    });
  }
  
  static withSearchArtistsFail(query: string) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&decorate_restrictions=false&include_external=audio&limit=1`, 500);
  } 
  
  static withSearchReleases(query: string, releases: Partial<SpotifySimplifiedAlbum>[], limit=10) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=album&q=${encodeURIComponent(query)}&decorate_restrictions=false&include_external=audio&limit=${limit}`, {
      albums: { items: releases } 
    });
  }
  
  static withSearchTracks(query: string, tracks: Partial<SpotifyTrack>[], limit=20) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}&decorate_restrictions=false&include_external=audio&limit=${limit}`, {
      tracks: { items: tracks } 
    });
  }
  
  static withSearchAll(query: string, artists: Partial<SpotifyArtist>[], releases: Partial<SpotifySimplifiedAlbum>[], tracks: Partial<SpotifyTrack>[]) {
    fetchMock.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist,album,track&decorate_restrictions=false&include_external=audio`, {
      artists: { items: artists },
      albums: { items: releases },
      tracks: { items: tracks }
    });
  }
  
  static withGetArtistDetails(artistId: string, artist: Partial<SpotifyFullArtist>) {
    fetchMock.get(`https://api.spotify.com/v1/artists/${artistId}`, artist);
  }
  
  static withGetArtistTopTracks(artistId: string, tracks: Partial<SpotifyTrack>[]) {
    fetchMock.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, { tracks });
  }
  
  static withGetSimilarArtists(artistId: string, artists: Partial<SpotifyArtist>[]) {
    fetchMock.get(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, { artists });
  }
  
  static withGetArtistsAlbums(artistId: string, albums: Partial<SpotifySimplifiedAlbum>[]) {
    fetchMock.get(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album`, { items: albums });
  }
  
  static withGetAlbum(albumId: string, album: Partial<SpotifyFullAlbum>) {
    fetchMock.get(`https://api.spotify.com/v1/albums/${albumId}`, album);
  }
  
  static withGetTopAlbum(query: string, album: Partial<SpotifySimplifiedAlbum>) {
    fetchMock.get(`https://api.spotify.com/v1/search?type=album&q=${encodeURIComponent(query)}&decorate_restrictions=false&best_match=true&include_external=audio&limit=1`, {
      best_match: { items: [album] } 
    });
  }
    
}
