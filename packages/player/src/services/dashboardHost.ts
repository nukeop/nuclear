import {
  MissingCapabilityError,
  type AttributedResult,
  type DashboardCapability,
  type DashboardHost,
  type DashboardProvider,
} from '@nuclearplayer/plugin-sdk';

import { reportError } from '../utils/logging';
import { providersHost } from './providersHost';

type FetchMethod = keyof {
  [
    K in keyof DashboardProvider as DashboardProvider[K] extends
      (() => Promise<unknown>) | undefined
      ? K
      : never
  ]: DashboardProvider[K];
};

const CAPABILITY_TO_METHOD: Record<DashboardCapability, FetchMethod> = {
  topTracks: 'fetchTopTracks',
  topArtists: 'fetchTopArtists',
  topAlbums: 'fetchTopAlbums',
  editorialPlaylists: 'fetchEditorialPlaylists',
  newReleases: 'fetchNewReleases',
};

const getDashboardProviders = (): DashboardProvider[] =>
  providersHost.list('dashboard') as DashboardProvider[];

const createAttributedFetcher =
  <T>(capability: DashboardCapability) =>
  async (providerId?: string): Promise<AttributedResult<T>[]> => {
    const method = CAPABILITY_TO_METHOD[capability];

    if (providerId) {
      const provider = providersHost.get<DashboardProvider>(
        providerId,
        'dashboard',
      );
      if (!provider) {
        throw new Error(`Dashboard provider not found: ${providerId}`);
      }
      if (!provider.capabilities.includes(capability)) {
        return [];
      }
      const fetchFn = provider[method] as (() => Promise<T[]>) | undefined;
      if (!fetchFn) {
        throw new MissingCapabilityError(capability, provider.name);
      }
      const items = await fetchFn();
      return [
        {
          providerId: provider.id,
          metadataProviderId: provider.metadataProviderId,
          providerName: provider.name,
          items,
        },
      ];
    }

    const providers = getDashboardProviders().filter((provider) =>
      provider.capabilities.includes(capability),
    );

    return (
      await Promise.all(
        providers.map(async (provider): Promise<AttributedResult<T> | null> => {
          try {
            const fetchFn = provider[method] as
              (() => Promise<T[]>) | undefined;
            if (!fetchFn) {
              throw new MissingCapabilityError(capability, provider.name);
            }
            const items = await fetchFn();
            return {
              providerId: provider.id,
              metadataProviderId: provider.metadataProviderId,
              providerName: provider.name,
              items,
            };
          } catch (error) {
            await reportError('dashboard', {
              userMessage: 'A dashboard provider failed to load data',
              error,
            });
            return null;
          }
        }),
      )
    ).filter((result): result is AttributedResult<T> => result !== null);
  };

export const createDashboardHost = (): DashboardHost => ({
  fetchTopTracks: createAttributedFetcher('topTracks'),
  fetchTopArtists: createAttributedFetcher('topArtists'),
  fetchTopAlbums: createAttributedFetcher('topAlbums'),
  fetchEditorialPlaylists: createAttributedFetcher('editorialPlaylists'),
  fetchNewReleases: createAttributedFetcher('newReleases'),
});

export const dashboardHost: DashboardHost = createDashboardHost();
