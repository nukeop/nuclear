import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createSelectWrapper } from '@nuclearplayer/ui';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { registerBuiltInCoreSettings } from '../../services/coreSettings';
import { providersHost } from '../../services/providersHost';
import { getSetting, useSettingsStore } from '../../stores/settingsStore';
import { LyricsProviderBuilder } from '../../test/builders/LyricsProviderBuilder';

const user = userEvent.setup();

const TEXT_SIZE_SETTING = 'core.lyrics.textSize';
const AUTO_SCROLL_SETTING = 'core.lyrics.autoScroll';
const ROW_HEIGHT_PX = 100;

const getViewport = () =>
  screen.getByTestId('lyrics-scroll-area').firstElementChild!;

export const LyricsWrapper = {
  reset() {
    providersHost.clear();
    useSettingsStore.setState({ values: {} });
    registerBuiltInCoreSettings();
  },

  setTextSize(size: number) {
    useSettingsStore.setState((state) => ({
      values: { ...state.values, [TEXT_SIZE_SETTING]: size },
    }));
  },

  get textSize() {
    return getSetting(TEXT_SIZE_SETTING);
  },

  textSizeMinus: {
    get element() {
      return screen.getByRole('button', { name: 'Smaller lyrics' });
    },
    async click() {
      await user.click(this.element);
    },
  },

  textSizePlus: {
    get element() {
      return screen.getByRole('button', { name: 'Larger lyrics' });
    },
    async click() {
      await user.click(this.element);
    },
  },

  setAutoScroll(isOn: boolean) {
    useSettingsStore.setState((state) => ({
      values: { ...state.values, [AUTO_SCROLL_SETTING]: isOn },
    }));
  },

  get autoScroll() {
    return getSetting(AUTO_SCROLL_SETTING);
  },

  autoScrollToggle: {
    get element() {
      return screen.getByRole('switch', { name: 'Auto-scroll' });
    },
    get isOn() {
      return this.element.getAttribute('aria-checked') === 'true';
    },
    get exists() {
      return screen.queryByRole('switch', { name: 'Auto-scroll' }) !== null;
    },
    async click() {
      await user.click(this.element);
    },
  },

  layOutRows() {
    const viewport = getViewport();
    screen.getAllByTestId(/^lyrics-(line|break)$/).forEach((row, index) => {
      vi.spyOn(row, 'getBoundingClientRect').mockImplementation(() =>
        DOMRect.fromRect({
          y: index * ROW_HEIGHT_PX - viewport.scrollTop,
          height: ROW_HEIGHT_PX,
        }),
      );
    });
  },

  get scrollPosition() {
    return getViewport().scrollTop;
  },

  registerProvider(builder: LyricsProviderBuilder) {
    providersHost.register(builder.build());
  },

  async mount(): Promise<RenderResult> {
    const history = createMemoryHistory({ initialEntries: ['/lyrics'] });
    const router = createRouter({ routeTree, history });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const component = render(
      <App routerProp={router} queryClientProp={queryClient} />,
    );
    await screen.findByTestId('lyrics-view');
    return component;
  },

  async findLyrics() {
    return screen.findByTestId('lyrics-content');
  },

  sourcePicker: createSelectWrapper(() =>
    screen.getByTestId('lyrics-source-picker'),
  ),

  emptyState: {
    async find() {
      return screen.findByTestId('lyrics-empty-state');
    },
    get title() {
      return within(screen.getByTestId('lyrics-empty-state')).getByRole(
        'heading',
      ).textContent;
    },
    get description() {
      return within(screen.getByTestId('lyrics-empty-state')).getByRole(
        'paragraph',
      ).textContent;
    },
    action: {
      async click() {
        await user.click(screen.getByTestId('lyrics-empty-state-action'));
      },
    },
  },

  get sections() {
    return screen.getAllByTestId('lyrics-section').map((section) => ({
      label: within(section).getByTestId('lyrics-section-label').textContent,
      lines: within(section)
        .getAllByTestId('lyrics-line')
        .map((line) => line.textContent),
    }));
  },

  get syncedLines() {
    return screen.getAllByTestId('lyrics-line').map((line) => ({
      text: line.textContent,
      isActive: line.dataset.active === 'true',
    }));
  },

  get syncedRows() {
    return screen.getAllByTestId(/^lyrics-(line|break)$/).map((row) => {
      const isActive = row.dataset.active === 'true';
      if (row.dataset.testid === 'lyrics-break') {
        return { type: 'break', isActive };
      }
      return { type: 'line', text: row.textContent, isActive };
    });
  },

  get syncedWords() {
    return screen.getAllByTestId('lyrics-word').map((word) => ({
      text: word.textContent,
      isActive: word.dataset.active === 'true',
    }));
  },

  get furigana() {
    return screen.getAllByTestId('lyrics-ruby').map((ruby) => ({
      text: within(ruby).getByTestId('lyrics-ruby-text').textContent,
      reading: within(ruby).getByTestId('lyrics-ruby-reading').textContent,
    }));
  },

  get annotations() {
    return screen.getAllByTestId('lyrics-annotation').map((annotation) => ({
      type: annotation.dataset.type,
      language: annotation.lang,
      text: annotation.textContent,
    }));
  },

  get backgroundVocals() {
    return screen
      .getAllByTestId('lyrics-background-vocals')
      .map((vocals) => vocals.textContent?.trim());
  },

  async clickLine(text: string) {
    await user.click(screen.getByRole('button', { name: text }));
  },

  offsetMinus: {
    async click() {
      await user.click(
        screen.getByRole('button', { name: 'Show lyrics earlier' }),
      );
    },
  },

  offsetPlus: {
    async click() {
      await user.click(
        screen.getByRole('button', { name: 'Show lyrics later' }),
      );
    },
  },

  get offsetControls() {
    return screen.queryByTestId('lyrics-offset-controls');
  },

  get loadingState() {
    return screen.getByTestId('lyrics-loading');
  },
};
