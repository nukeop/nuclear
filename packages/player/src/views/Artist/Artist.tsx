import { useParams } from '@tanstack/react-router';
import { FC, useMemo } from 'react';

import type { MetadataProvider } from '@nuclearplayer/plugin-sdk';
import { ScrollableArea } from '@nuclearplayer/ui';

import { providersHost } from '../../services/providersHost';
import { ARTIST_WIDGETS, groupWidgets } from './artistWidgets';

type ArtistProps = Record<string, never>;

export const Artist: FC<ArtistProps> = () => {
  const { providerId, artistId } = useParams({
    from: '/artist/$providerId/$artistId',
  });

  const provider = useMemo(() => {
    return providersHost.get<MetadataProvider>(providerId, 'metadata');
  }, [providerId]);

  const capabilities = new Set(provider?.artistMetadataCapabilities ?? []);

  const activeWidgets = ARTIST_WIDGETS.filter((widget) =>
    capabilities.has(widget.capability),
  );

  const widgetGroups = groupWidgets(activeWidgets);

  return (
    <ScrollableArea className="surface-background">
      {widgetGroups.map((group) => {
        if (group.entries.length === 1) {
          const SingleWidget = group.entries[0].component;
          return (
            <SingleWidget
              key={group.key}
              providerId={providerId}
              artistId={artistId}
            />
          );
        }

        return (
          <div
            key={group.key}
            className="mx-4 mb-4 flex flex-col gap-4 md:flex-row"
          >
            {group.entries.map(({ capability, component: Widget, width }) => (
              <div key={capability} className={width}>
                <Widget providerId={providerId} artistId={artistId} />
              </div>
            ))}
          </div>
        );
      })}
    </ScrollableArea>
  );
};
