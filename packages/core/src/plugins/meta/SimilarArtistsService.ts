import { LastFmArtistInfo, LastfmArtistShort } from '../../rest/Lastfm.types';
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
    const similarArtists = artist.similar.artist;
    try {
      const spotifyToken = await getToken();
      return await this.createTopSimilarArtists(similarArtists, spotifyToken);
    } catch (error) {
      logger.error(`Failed to fetch similar artists for '${artist.name}'`);
      logger.error(error);
    }
    return [];
  }

  async createTopSimilarArtists(artists: LastfmArtistShort[], spotifyToken: string) {
    return Promise.all(
      artists
        .filter(artist => artist?.name)
        .slice(0, SimilarArtistsService.TOP_ARTIST_COUNT)
        .map(artist => this.createSimilarArtist(artist.name, spotifyToken))
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
