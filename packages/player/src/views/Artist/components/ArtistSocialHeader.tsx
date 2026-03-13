import {
  ListMusic,
  LucideIcon,
  MapPin,
  Music,
  UserPlus,
  Users,
} from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';
import { Loader, StatChip } from '@nuclearplayer/ui';

import { ConnectedFavoriteButton } from '../../../components/ConnectedFavoriteButton';
import { useArtistSocialStats } from '../hooks/useArtistSocialStats';

const AVATAR_SIZE_PX = 300;

const compactFormatter = new Intl.NumberFormat('en', { notation: 'compact' });

const formatCompact = (value: number): string => compactFormatter.format(value);

type StatDefinition = {
  key: string;
  icon: LucideIcon;
  labelKey: string;
  value: number | undefined;
};

type ActiveStat = StatDefinition & { value: number };

type ArtistSocialHeaderProps = {
  providerId: string;
  artistId: string;
};

export const ArtistSocialHeader: FC<ArtistSocialHeaderProps> = ({
  providerId,
  artistId,
}) => {
  const { t } = useTranslation('artist');
  const {
    data: stats,
    isLoading,
    isError,
  } = useArtistSocialStats(providerId, artistId);

  if (isLoading) {
    return (
      <div
        className="m-4 flex items-center justify-center"
        data-testid="artist-social-header"
      >
        <Loader data-testid="artist-social-header-loader" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="m-4 flex flex-col items-start gap-3"
        data-testid="artist-social-header"
      >
        <div className="text-accent-red">
          {t('errors.failedToLoadSocialStats')}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const avatar = pickArtwork(stats.artwork, 'avatar', AVATAR_SIZE_PX);

  const location = [stats.city, stats.country].filter(Boolean).join(', ');

  const statDefinitions = [
    {
      key: 'followers',
      icon: Users,
      labelKey: 'followers',
      value: stats.followersCount,
    },
    {
      key: 'followings',
      icon: UserPlus,
      labelKey: 'followings',
      value: stats.followingsCount,
    },
    {
      key: 'tracks',
      icon: Music,
      labelKey: 'tracks',
      value: stats.trackCount,
    },
    {
      key: 'playlists',
      icon: ListMusic,
      labelKey: 'playlists',
      value: stats.playlistCount,
    },
  ].filter(
    (stat): stat is ActiveStat => stat.value !== undefined && stat.value > 0,
  );

  return (
    <div
      className="border-border bg-primary shadow-shadow relative m-4 rounded-md border-(length:--border-width) p-6"
      data-testid="artist-social-header"
    >
      <ConnectedFavoriteButton
        type="artist"
        source={{ provider: providerId, id: artistId }}
        data={{ name: stats.name, artwork: stats.artwork }}
        className="bg-background border-border absolute top-4 right-4 z-10 rounded-md border-(length:--border-width)"
        data-testid="artist-favorite-button"
      />
      <div className="flex items-center gap-5">
        {avatar && (
          <img
            className="border-border shadow-shadow h-24 w-24 rounded-full border-(length:--border-width) object-cover"
            src={avatar.url}
            alt={`${stats.name} avatar`}
          />
        )}
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight">
            {stats.name}
          </h2>
          {location && (
            <span className="bg-accent-orange border-border inline-flex w-fit items-center gap-1 rounded-md border px-2 py-0.5 text-sm font-bold">
              <MapPin size={14} />
              {location}
            </span>
          )}
        </div>
      </div>
      {statDefinitions.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-3">
          {statDefinitions.map((stat) => (
            <StatChip
              key={stat.key}
              value={formatCompact(stat.value)}
              label={t(stat.labelKey)}
              icon={<stat.icon size={16} />}
            />
          ))}
        </div>
      )}
    </div>
  );
};
