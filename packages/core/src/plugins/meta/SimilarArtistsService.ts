import { LastFmArtistInfo } from '../../rest/Lastfm.types';
import { SpotifyClientProvider } from '../../rest/Spotify';
import { SimilarArtist } from '../plugins.types';
import { logger } from '../..';

/**
 * Creates SimilarArtist instances using the provided LastFmArtistInfo.
 * Artist image URLs are fetched from Spotify.
 */
class SimilarArtistsService {
  static readonly TOP_ARTIST_COUNT = 5;

  async createSimilarArtists(
    artist: LastFmArtistInfo | undefined
  ): Promise<SimilarArtist[]> {
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
      .filter((artist) => artist?.name)
      .slice(0, SimilarArtistsService.TOP_ARTIST_COUNT)
      .map((artist) => artist.name);
  }

  async createTopSimilarArtists(artistNames: string[]) {
    return Promise.all(
      artistNames.map((artistName) => this.createSimilarArtist(artistName))
    );
  }

  async createSimilarArtist(artistName: string): Promise<SimilarArtist> {
    return {
      name: artistName,
      thumbnail: await this.fetchSimilarArtistThumbnailUrlFromSpotify(
        artistName
      )
    };
  }

  async fetchSimilarArtistThumbnailUrlFromSpotify(artistName: string) {
    try {
      const spotifyArtist = await (
        await SpotifyClientProvider.get()
      ).getTopArtist(artistName);
      return spotifyArtist?.images[0].url;
    } catch (error) {
      logger.error(
        `Failed to fetch artist thumbnail from Spotify: '${artistName}'`
      );
      logger.error(error);
    }
    return null;
  }
}

export default SimilarArtistsService;
