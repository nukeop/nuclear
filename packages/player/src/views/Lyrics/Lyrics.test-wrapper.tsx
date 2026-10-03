import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { QueueItem } from '@nuclearplayer/model';
import { createSelectWrapper } from '@nuclearplayer/ui';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { providersHost } from '../../services/providersHost';
import { useQueueStore } from '../../stores/queueStore';
import { getSetting, useSettingsStore } from '../../stores/settingsStore';
import { useSoundStore } from '../../stores/soundStore';
import { LyricsProviderBuilder } from '../../test/builders/LyricsProviderBuilder';

const user = userEvent.setup();

const TEXT_SIZE_SETTING = 'core.lyrics.textSize';

export const LyricsWrapper = {
  reset() {
    providersHost.clear();
    useQueueStore.setState({ items: [], currentIndex: 0 });
    useSoundStore.setState({ seek: 0 });
    useSettingsStore.setState({ values: {} });
  },

  setTextSize(size: string) {
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

  setPlaybackPosition(seconds: number) {
    useSoundStore.setState({ seek: seconds });
  },

  setQueue(...items: QueueItem[]) {
    useQueueStore.setState({ items, currentIndex: 0 });
  },

  registerProvider(builder: LyricsProviderBuilder) {
    providersHost.register(builder.build());
  },

  async mount(): Promise<RenderResult> {
    const history = createMemoryHistory({ initialEntries: ['/lyrics'] });
    const router = createRouter({ routeTree, history });
    const component = render(<App routerProp={router} />);
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

  get syncedWords() {
    return screen.getAllByTestId('lyrics-word').map((word) => ({
      text: word.textContent,
      isActive: word.dataset.active === 'true',
    }));
  },

  async clickLine(text: string) {
    await user.click(screen.getByRole('button', { name: text }));
  },

  get playbackPosition() {
    return useSoundStore.getState().seek;
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
