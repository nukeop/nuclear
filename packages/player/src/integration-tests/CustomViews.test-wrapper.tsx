import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import {
  render,
  RenderResult,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

import App from '../App';
import { routeTree } from '../routeTree.gen';
import { useCustomViewsStore } from '../stores/customViewsStore';

const user = userEvent.setup();

export const CustomViewsWrapper = {
  reset() {
    useCustomViewsStore.setState({ views: {} });
    toast.dismiss();
  },

  async mount(initialPath: string): Promise<RenderResult> {
    const history = createMemoryHistory({ initialEntries: [initialPath] });
    const router = createRouter({ routeTree, history });
    const component = render(
      <App routerProp={router} queryClientProp={new QueryClient()} />,
    );
    await screen.findByTestId('custom-view-sidebar-entries');
    return component;
  },

  sidebar: {
    get entryTitles() {
      return within(screen.getByTestId('custom-view-sidebar-entries'))
        .queryAllByRole('link')
        .map((link) => link.textContent);
    },
    entry(title: string) {
      return {
        get element() {
          return within(
            screen.getByTestId('custom-view-sidebar-entries'),
          ).getByRole('link', { name: title });
        },
        async click() {
          await user.click(this.element);
        },
      };
    },
  },

  tailwindStyles: {
    get element() {
      return screen.queryByTestId('custom-view-tailwind-styles');
    },
    async findText() {
      const style = await screen.findByTestId('custom-view-tailwind-styles');
      await waitFor(() => expect(style.textContent).not.toBe(''));
      return style.textContent;
    },
  },

  portalContent: {
    find() {
      return screen.findByTestId('portal-content');
    },
  },

  styledPage: {
    find() {
      return screen.findByTestId('styled-page');
    },
  },

  crashToast: {
    find() {
      return screen.findByTestId('custom-view-crash-toast');
    },
    get text() {
      return screen.getByTestId('custom-view-crash-toast').textContent;
    },
  },

  topBar: {
    backButton: {
      get element() {
        return screen.getByTestId('top-bar-back');
      },
      async click() {
        await user.click(this.element);
      },
    },
  },

  podcastList: {
    find() {
      return screen.findByTestId('podcast-list');
    },
    latestEpisodeButton: {
      get element() {
        return screen.getByTestId('podcast-list-latest-episode');
      },
      async click() {
        await user.click(this.element);
      },
    },
    manageSourcesButton: {
      get element() {
        return screen.getByTestId('podcast-list-manage-sources');
      },
      async click() {
        await user.click(this.element);
      },
    },
  },

  episodePage: {
    find() {
      return screen.findByTestId('episode-page');
    },
    get text() {
      return screen.getByTestId('episode-page').textContent;
    },
  },

  redesignedPodcastList: {
    find() {
      return screen.findByTestId('redesigned-podcast-list');
    },
  },

  statsOverview: {
    find() {
      return screen.findByTestId('stats-overview');
    },
    month(month: number) {
      return {
        get element() {
          return screen.getByTestId(`stats-overview-month-${month}`);
        },
        async click() {
          await user.click(this.element);
        },
      };
    },
  },

  statsMonth: {
    find() {
      return screen.findByTestId('stats-month');
    },
    get text() {
      return screen.getByTestId('stats-month').textContent;
    },
  },

  toolboxRefreshButton: {
    find() {
      return screen.findByTestId('toolbox-refresh');
    },
    get text() {
      return screen.getByTestId('toolbox-refresh').textContent;
    },
  },
};
