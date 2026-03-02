import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';

const user = userEvent.setup();

async function openWhatsNewTab(component: RenderResult) {
  await user.click(
    await component.findByRole('button', { name: 'Preferences' }),
  );
  await user.click(
    await component.findByRole('button', { name: "What's New" }),
  );
}

function entryAccessor(entryElement: HTMLElement) {
  return {
    get date() {
      return within(entryElement).getByTestId('changelog-date');
    },
    get description() {
      return within(entryElement).getByTestId('changelog-description');
    },
    get typeBadge() {
      return within(entryElement).getByTestId('changelog-type-badge');
    },
    get contributors() {
      return within(entryElement).queryAllByTestId('changelog-contributor');
    },
    get tags() {
      return within(entryElement).queryAllByTestId('changelog-tag-badge');
    },
  };
}

export const WhatsNewWrapper = {
  async mount(): Promise<RenderResult> {
    const component = render(<App />);
    await openWhatsNewTab(component);
    return component;
  },

  get title() {
    return screen.getByRole('heading', { level: 1 });
  },

  get entries() {
    return screen.getAllByTestId('changelog-entry');
  },

  entry(index: number) {
    return entryAccessor(this.entries[index]);
  },

  seeMoreButton: {
    get element() {
      return screen.getByRole('button', { name: /see more/i });
    },
    get query() {
      return screen.queryByRole('button', { name: /see more/i });
    },
    async click() {
      await user.click(this.element);
    },
  },
};
