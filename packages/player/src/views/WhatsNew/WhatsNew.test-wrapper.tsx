import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { TEST_CHANGELOG } from '../../test/fixtures/changelog';
import { Changelog } from '../../types/changelog';

const user = userEvent.setup();

let activeChangelog: Changelog = TEST_CHANGELOG;

vi.mock('../../../changelog.json', () => ({
  get default() {
    return activeChangelog;
  },
}));

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
    get description() {
      return within(entryElement).getByTestId('changelog-description');
    },
    get typeBadge() {
      return within(entryElement).getByTestId('changelog-type-badge');
    },
    get contributor() {
      return within(entryElement).queryByTestId('changelog-contributor');
    },
    get tags() {
      return within(entryElement).queryAllByTestId('changelog-tag-badge');
    },
  };
}

export const WhatsNewWrapper = {
  async mount(changelog?: Changelog): Promise<RenderResult> {
    activeChangelog = changelog ?? TEST_CHANGELOG;
    const component = render(<App />);
    await openWhatsNewTab(component);
    return component;
  },

  get title() {
    return screen.getByTestId('view-shell-title');
  },

  version(versionString: string) {
    return {
      get header() {
        return screen.getByTestId(`changelog-version-${versionString}`);
      },
      get query() {
        return screen.queryByTestId(`changelog-version-${versionString}`);
      },
      entry(index: number) {
        const section = screen.getByTestId(
          `changelog-version-section-${versionString}`,
        );
        const entries = within(section).getAllByTestId('changelog-entry');
        return entryAccessor(entries[index]);
      },
    };
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
