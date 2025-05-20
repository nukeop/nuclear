import { getLargestThumbnail, getThumbnailSizedImage, logger } from '../../';
import { TOTP } from './soytify-totp';
import { OperationName, SoytifyArtistOverviewResponse, SoytifySearchV2Response } from './Soytify.types';
import {
  mapSoytifyArtistSearchResult,
  mapSoytifyReleaseSearchResult,
  mapSoytifyTrackSearchResult
} from './soytify-mappers';
import { ArtistDetails, SearchResultsSource } from '../../plugins/plugins.types';

const SOYTIFY_API_OPEN_URL = 'https://open.' + atob('c3BvdGlmeQ==') + '.com';
const SOYTIFY_BASE_URL =
  'https://api-partner.' + atob('c3BvdGlmeQ==') + '.com/pathfinder/v2/query';

const OPERATION_HASHES: Record<OperationName, string> = {
  searchDesktop:
    'd9f785900f0710b31c07818d617f4f7600c1e21217e80f5b043d1e78d74e6026',
  searchArtists:
    '0e6f9020a66fe15b93b3bb5c7e6484d1d8cb3775963996eaede72bac4d97e909',
  searchAlbums:
    'a71d2c993fc98e1c880093738a55a38b57e69cc4ce5a8c113e6c5920f9513ee2',
  searchTracks:
    'bc1ca2fcd0ba1013a0fc88e6cc4f190af501851e3dafd3e1ef85840297694428',
  searchPlaylists:
    'fc3a690182167dbad20ac7a03f842b97be4e9737710600874cb903f30112ad58',
  queryArtistOverview:
    '1ac33ddab5d39a3a9c27802774e6d78b9405cc188c6f75aed007df2a32737c72',
  getAlbum: '97dd13a1f28c80d66115a13697a7ffd94fe3bebdb94da42159456e1d82bfee76'
};

export class SoytifyClient {
  private _token: string | undefined;
  private totp: TOTP;

  constructor() {
    this.totp = new TOTP();
  }

  get token() {
    return this._token;
  }

  async init() {
    return this.refreshToken();
  }

  async refreshToken() {
    try {
      const serverTimeResponse = await fetch(
        `${SOYTIFY_API_OPEN_URL}/server-time`
      );
      if (!serverTimeResponse.ok) {
        throw new Error(
          `Failed to get server time: ${serverTimeResponse.status}`
        );
      }

      const serverTimeData = await serverTimeResponse.json();
      const serverTime = 1000 * serverTimeData.serverTime;

      const totpToken = this.totp.generate(serverTime);

      const tokenResponse = await fetch(
        `${SOYTIFY_API_OPEN_URL}/get_access_token?reason=init&productType=web-player&totp=${totpToken}&totpVer=${this.totp.getVersion()}&sTime=${serverTime}&cTime=${Date.now()}&buildVer=web-player_2025-05-12_1747082920646_8ab14aa&buildDate=2025-05-12&totpServer=010137`
      );

      if (!tokenResponse.ok) {
        throw new Error(`Failed to get access token: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      this._token = tokenData.accessToken;
    } catch (error) {
      logger.error('Failed to refresh Spotify token:', error);
      const tokenData = await (
        await fetch(
          `${SOYTIFY_API_OPEN_URL}/get_access_token?reason=transport&productType=web_player`
        )
      ).json();
      this._token = tokenData.accessToken;
    }
  }

  async post(url: string, body?: any) {
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this._token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (result.ok) {
      return result.json();
    } else if (result.status === 401) {
      await this.refreshToken();
      return this.post(url, body);
    } else {
      const body = await result.json();
      throw new Error(body);
    }
  }

  async runQuery<Response>({
    operationName,
    args
  }: {
    operationName: OperationName;
    args: Record<string, string | number | boolean>;
  }) {
    const data: Response = await this.post(SOYTIFY_BASE_URL, {
      operationName,
      variables: {
        ...args
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: OPERATION_HASHES[operationName]
        }
      }
    });

    return data;
  }

  async searchQuery({
    operationName,
    searchTerm
  }: {
    operationName: OperationName;
    searchTerm: string;
  }) {
    const data = await this.runQuery<SoytifySearchV2Response>({
      operationName,
      args: {
        searchTerm,
        limit: 30,
        offset: 0,
        numberOfTopResults: 30,
        includeAudiobooks: false,
        includeArtistHasConcertsField: true,
        includePreReleases: true,
        includeLocalConcertsField: true
      }
    });

    return data;
  }

  async searchArtists(searchTerm: string) {
    const artists = await this.searchQuery({
      operationName: 'searchArtists',
      searchTerm
    });
    return artists.data.searchV2.artists.items.map(
      mapSoytifyArtistSearchResult
    );
  }

  async searchReleases(searchTerm: string) {
    const releases = await this.searchQuery({
      operationName: 'searchAlbums',
      searchTerm
    });
    return releases.data.searchV2.albumsV2.items.map(
      mapSoytifyReleaseSearchResult
    );
  }

  async searchTracks(searchTerm: string) {
    const tracks = await this.searchQuery({
      operationName: 'searchTracks',
      searchTerm
    });
    return tracks.data.searchV2.tracksV2.items.filter(wrapper => wrapper.item.data.__typename !== 'NotFound').map(mapSoytifyTrackSearchResult);
  }

  async searchAll(searchTerm: string) {
    const {
      data: { searchV2 }
    } = await this.searchQuery({ operationName: 'searchDesktop', searchTerm });

    return {
      artists: searchV2.artists.items.map(mapSoytifyArtistSearchResult),
      releases: searchV2.albumsV2.items.map(mapSoytifyReleaseSearchResult),
      tracks: searchV2.tracksV2.items.filter(wrapper => wrapper.item.data.__typename !== 'NotFound').map(mapSoytifyTrackSearchResult)
    };
  }

  async fetchArtistDetails(artistId: string): Promise<ArtistDetails> {
    const {data: {artistUnion: artist}} = await this.runQuery<SoytifyArtistOverviewResponse>({
      operationName: 'queryArtistOverview',
      args: {uri: artistId, locale: ''}
    });

    return {
      id: artist.uri,
      name: artist.profile.name,
      coverImage: artist.headerImage.url,
      thumb: getThumbnailSizedImage(artist.visuals.avatarImage.sources),
      images: artist.visuals.gallery.items.map(item => getLargestThumbnail(item.sources)),
      topTracks: artist.discography.topTracks.items.map(track => ({})),
      similar: artist.relatedContent.relatedArtists.items.map(artist => ({})),
      source: SearchResultsSource.Soytify
    };
  }
}

export class SoytifyClientProvider {
  private static instance: SoytifyClient;

  static async get() {
    if (!this.instance) {
      this.instance = new SoytifyClient();
      await this.instance.init();
    }
    return this.instance;
  }
}
