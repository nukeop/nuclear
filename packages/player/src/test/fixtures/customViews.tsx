import { createPortal } from 'react-dom';

import type {
  CustomViewComponent,
  CustomViewDefinition,
} from '@nuclearplayer/plugin-sdk';

import type { RawViewDefinition } from '../../services/bridge/hydrateView';

const createPodcastList =
  (pluginId: string): CustomViewComponent =>
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

const EpisodePage: CustomViewComponent = ({ params }) => (
  <div data-testid="episode-page">
    {`Show ${params.showId}, episode ${params.episodeId}`}
  </div>
);

const RedesignedPodcastList: CustomViewComponent = () => (
  <div data-testid="redesigned-podcast-list" />
);

export const createPodcastsView = (pluginId: string): CustomViewDefinition => ({
  id: 'podcasts',
  title: 'Podcasts',
  icon: 'Podcast',
  routes: [
    { path: '/', component: createPodcastList(pluginId) },
    { path: '/show/$showId/episode/$episodeId', component: EpisodePage },
  ],
});

export const REDESIGNED_PODCASTS_VIEW: CustomViewDefinition = {
  id: 'podcasts',
  title: 'Podcasts',
  icon: 'Podcast',
  routes: [{ path: '/', component: RedesignedPodcastList }],
};

const StyledPage: CustomViewComponent = () => (
  <div data-testid="styled-page" className="bg-accent-orange/40 animate-in" />
);

export const STYLED_VIEW: CustomViewDefinition = {
  id: 'styled',
  title: 'Styled',
  icon: 'Palette',
  routes: [{ path: '/', component: StyledPage }],
};

const PortalPage: CustomViewComponent = () =>
  createPortal(
    <div data-testid="portal-content" className="bg-accent-green/45" />,
    document.body,
  );

export const PORTAL_VIEW: CustomViewDefinition = {
  id: 'portal',
  title: 'Portal',
  icon: 'Layers',
  routes: [{ path: '/', component: PortalPage }],
};

const CrashingPage: CustomViewComponent = () => {
  throw new Error('Broken view');
};

export const CRASHING_VIEW: CustomViewDefinition = {
  id: 'broken',
  title: 'Broken',
  icon: 'Bug',
  routes: [{ path: '/', component: CrashingPage }],
};

export const ROUTELESS_VIEW: CustomViewDefinition = {
  id: 'routeless',
  title: 'Routeless',
  icon: 'Bug',
  routes: [],
};

export const UNKNOWN_ICON_VIEW: CustomViewDefinition = {
  id: 'mystery',
  title: 'Mystery',
  icon: 'NoSuchIcon',
  routes: [{ path: '/', component: RedesignedPodcastList }],
};

export const RAW_STATS_VIEW: RawViewDefinition = {
  id: 'stats-2026',
  title: 'Stats 2026',
  icon: 'ChartBar',
  source: `
    import type { CustomViewProps } from '@nuclearplayer/plugin-sdk';

    export default function Stats({ api }: CustomViewProps) {
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

    export function Month({ params }: CustomViewProps) {
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
