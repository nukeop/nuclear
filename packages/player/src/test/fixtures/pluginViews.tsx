import type {
  PluginViewComponent,
  PluginViewDefinition,
} from '@nuclearplayer/plugin-sdk';

import type { RawViewDefinition } from '../../services/bridge/hydrateView';

const createPodcastList =
  (pluginId: string): PluginViewComponent =>
  ({ api }) => (
    <div data-testid="podcast-list">
      <button
        data-testid="podcast-list-latest-episode"
        onClick={() =>
          api.Navigation.navigate(
            `/plugin/${pluginId}/podcasts/show/7/episode/42`,
          )
        }
      >
        Latest episode
      </button>
      <button
        data-testid="podcast-list-manage-sources"
        onClick={() => api.Navigation.navigate('/sources')}
      >
        Manage sources
      </button>
    </div>
  );

const EpisodePage: PluginViewComponent = ({ params }) => (
  <div data-testid="episode-page">
    {`Show ${params.showId}, episode ${params.episodeId}`}
  </div>
);

const RedesignedPodcastList: PluginViewComponent = () => (
  <div data-testid="redesigned-podcast-list" />
);

export const createPodcastsView = (pluginId: string): PluginViewDefinition => ({
  id: 'podcasts',
  title: 'Podcasts',
  icon: 'Podcast',
  routes: [
    { path: '/', component: createPodcastList(pluginId) },
    { path: '/show/$showId/episode/$episodeId', component: EpisodePage },
  ],
});

export const REDESIGNED_PODCASTS_VIEW: PluginViewDefinition = {
  id: 'podcasts',
  title: 'Podcasts',
  icon: 'Podcast',
  routes: [{ path: '/', component: RedesignedPodcastList }],
};

export const RAW_STATS_VIEW: RawViewDefinition = {
  id: 'stats-2026',
  title: 'Stats 2026',
  icon: 'ChartBar',
  source: `
    import type { PluginViewProps } from '@nuclearplayer/plugin-sdk';

    export default function Stats({ api }: PluginViewProps) {
      return (
        <div data-testid="stats-overview">
          <button
            data-testid="stats-overview-month-3"
            onClick={() => api.Navigation.navigate('/plugin/bridge/stats-2026/month/3')}
          >
            March
          </button>
        </div>
      );
    }

    export function Month({ params }: PluginViewProps) {
      return <div data-testid="stats-month">{'Month ' + params.month}</div>;
    }
  `,
  routes: [{ path: '/' }, { path: '/month/$month', export: 'Month' }],
};

export const RAW_TOOLBOX_VIEW: RawViewDefinition = {
  id: 'toolbox',
  title: 'Toolbox',
  icon: 'Wrench',
  source: `
    import { Button } from '@nuclearplayer/ui';

    export default function Toolbox() {
      return <Button data-testid="toolbox-refresh">Refresh stats</Button>;
    }
  `,
  routes: [{ path: '/' }],
};
