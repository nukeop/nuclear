import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { Update } from '@tauri-apps/plugin-updater';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { routeTree } from '../routeTree.gen';
import { useSettingsStore } from '../stores/settingsStore';
import { useUpdaterStore } from '../stores/updaterStore';

const user = userEvent.setup();

export const UpdateWrapper = {
  async mount(): Promise<RenderResult> {
    const history = createMemoryHistory({ initialEntries: ['/dashboard'] });
    const router = createRouter({ routeTree, history });
    const result = render(<App routerProp={router} />);
    await screen.findByTestId('sidebar-toggle-right');
    return result;
  },

  badge: {
    get element() {
      return screen.queryByTestId('update-badge');
    },
    async click() {
      await user.click(screen.getByTestId('update-badge'));
    },
  },

  seedUpdateAvailable(options?: {
    downloadBehavior?: 'immediate' | 'pending';
  }) {
    const downloadAndInstall = vi.fn(
      async (callback?: (event: unknown) => void) => {
        if (options?.downloadBehavior !== 'pending') {
          callback?.({ event: 'Started', data: { contentLength: 1000 } });
          callback?.({ event: 'Progress', data: { chunkLength: 500 } });
          callback?.({ event: 'Progress', data: { chunkLength: 500 } });
          callback?.({ event: 'Finished', data: {} });
        }
      },
    );

    useUpdaterStore.setState({
      isUpdateAvailable: true,
      updateInfo: { downloadAndInstall } as unknown as Update,
    });

    return { downloadAndInstall };
  },

  seedDownloading(progress: number) {
    useUpdaterStore.setState({
      isDownloading: true,
      downloadProgress: progress,
    });
  },

  seedReadyToRestart() {
    useUpdaterStore.setState({
      isReadyToRestart: true,
    });
  },

  setAutoInstall(enabled: boolean) {
    useSettingsStore.setState({
      values: {
        ...useSettingsStore.getState().values,
        'core.updates.autoInstall': enabled,
      },
    });
  },
};
