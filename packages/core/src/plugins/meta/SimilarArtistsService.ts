import { LastFmArtistInfo } from '../../rest/Lastfm.types';
import { SimilarArtist } from '../plugins.types';
import { getToken, searchArtists } from '../../rest/Spotify';
import logger from 'electron-timber';

/**
 * Creates SimilarArtist instances using the provided LastFmArtistInfo.
 * Artist image URLs are fetched from Spotify.
 */
class SimilarArtistsService {
  static readonly TOP_ARTIST_COUNT = 5;

  async createSimilarArtists(artist: LastFmArtistInfo | undefined): Promise<SimilarArtist[]> {
    if (!artist?.similar?.artist) {
      return [];
    }
    const similarArtistNames = this.extractTopSimilarArtistNames(artist);
    try {
      return await this.createTopSimilarArtists(similarArtistNames);
    } catch (error) {
      logger.error(`Failed to fetch similar artists for '${artist.name}'`);
      logger.error(error);
    }
    return [];
  }

  extractTopSimilarArtistNames(artist: LastFmArtistInfo) {
    return artist.similar.artist
      .filter(artist => artist?.name)
      .slice(0, SimilarArtistsService.TOP_ARTIST_COUNT)
      .map(artist => artist.name);
  }

  async createTopSimilarArtists(artistNames: string[]) {
    const spotifyToken = await getToken();
    return Promise.all(
      artistNames.map(artistName => this.createSimilarArtist(artistName, spotifyToken))
    );
  }

  async createSimilarArtist(artistName: string, spotifyToken: string): Promise<SimilarArtist> {
    return {
      name: artistName,
      thumbnail: await this.fetchSimilarArtistThumbnailUrlFromSpotify(artistName, spotifyToken)
    };
  }

  async fetchSimilarArtistThumbnailUrlFromSpotify(artistName: string, spotifyToken: string) {
    try {
      const spotifyArtist = await searchArtists(spotifyToken, artistName);
      return spotifyArtist?.images[0].url;
    } catch (error) {
      logger.error(`Failed to fetch artist thumbnail from Spotify: '${artistName}'`);
      logger.error(error);
    }
    return null;
  }
}

export default SimilarArtistsService;
