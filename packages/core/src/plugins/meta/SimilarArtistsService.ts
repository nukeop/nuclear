import { LastFmArtistInfo, LastfmArtistShort } from '../../rest/Lastfm.types';
import { SimilarArtist } from '../plugins.types';
import { getToken, searchArtists } from '../../rest/Spotify';
import logger from 'electron-timber';

/**
 * Creates SimilarArtist instances using the provided LastFmArtistInfo.
 * Artist image URLs are fetched from Spotify.
 */
class SimilarArtistsService {

  async createSimilarArtists(artist: LastFmArtistInfo | undefined): Promise<SimilarArtist[]> {
    if (!artist?.similar?.artist) {
      return [];
    }
    const similarArtists = artist.similar.artist;
    try {
      const spotifyToken = await getToken();
      return await this.fetchTopSimilarArtistsFromSpotify(similarArtists, spotifyToken);
    } catch (error) {
      logger.error(`Failed to fetch similar artists for '${artist.name}'`);
      logger.error(error);
    }
    return [];
  }

  async fetchTopSimilarArtistsFromSpotify(artists: LastfmArtistShort[], spotifyToken: string) {
    return Promise.all(
      artists
        .filter(artist => artist?.name)
        .slice(0, 5)
        .map(artist => this.fetchSimilarArtistFromSpotify(artist.name, spotifyToken))
    );
  }

  async fetchSimilarArtistFromSpotify(artistName: string, spotifyToken: string): Promise<SimilarArtist> {
    return searchArtists(spotifyToken, artistName)
      .then(spotifyArtist => {
        return {
          name: artistName,
          thumbnail: spotifyArtist?.images[0]?.url
        };
      })
      .catch(error => {
        logger.error(`Failed to fetch artist from Spotify: '${artistName}'`);
        logger.error(error);
        return {
          name: artistName,
          thumbnail: null
        };
      });
  }

}

export default SimilarArtistsService;
