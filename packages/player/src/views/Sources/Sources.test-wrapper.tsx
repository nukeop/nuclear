import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen, within } from '@testing-library/react';

import { createSelectWrapper } from '@nuclearplayer/ui';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';

export const SourcesWrapper = {
  async mount(): Promise<RenderResult> {
    const history = createMemoryHistory({ initialEntries: ['/sources'] });
    const router = createRouter({ routeTree, history });
    const component = render(<App routerProp={router} />);
    await screen.findByTestId('sources-view');
    return component;
  },

  section(kind: string) {
    const getElement = () => screen.getByTestId(`sources-section-${kind}`);
    return {
      get element() {
        return getElement();
      },
      providerSelect: createSelectWrapper(getElement),
      get providerNames() {
        return within(getElement())
          .getAllByTestId('provider-list-item')
          .map((el) => el.textContent!.trim());
      },
      get lockedReason() {
        return within(getElement()).queryByTestId('locked-reason');
      },
      provider(name: string) {
        return {
          get warning() {
            return within(getElement()).getByTestId(`provider-warning-${name}`);
          },
        };
      },
    };
  },
};
