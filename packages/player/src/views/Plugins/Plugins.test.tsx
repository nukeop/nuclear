import { mockIPC } from '@tauri-apps/api/mocks';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PluginDialogMock } from '../../test/mocks/plugin-dialog';
import { PluginFsMock } from '../../test/mocks/plugin-fs';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { AppData } from '../../test/utils/testPluginFolder';
import { PluginsWrapper } from './Plugins.test-wrapper';
import { fakePluginManifest } from './Plugins.test.data';

const mockCopyDirRecursive = () =>
  mockIPC((cmd) => {
    if (cmd === 'copy_dir_recursive') {
      return true;
    }
  });

describe('Plugins view', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    mockCopyDirRecursive();
  });

  it('(Snapshot) renders the plugins view', async () => {
    const component = (await PluginsWrapper.mount()).getByRole('dialog');
    expect(component).toMatchSnapshot();
  });

  it('adds a plugin and enables it', async () => {
    PluginDialogMock.setOpen('/path/to/plugin');

    const readTextFileMock = PluginFsMock.setReadTextFile(fakePluginManifest);
    PluginFsMock.setExistsFor('plugins', AppData, true);

    await PluginsWrapper.mount();
    await userEvent.click(screen.getByText('Add Plugin'));

    // Manifest has been read
    await waitFor(() => {
      expect(readTextFileMock).nthCalledWith(1, '/path/to/plugin/package.json');
    });

    // After copying the plugin to managed folder, its manifest has been read
    await waitFor(() => {
      expect(readTextFileMock).nthCalledWith(
        3,
        `${AppData}/plugins/nuclear-fake-plugin/0.1.0/package.json`,
      );
    });

    // Code has been read (in the managed location)
    await waitFor(() => {
      expect(readTextFileMock).nthCalledWith(
        4,
        `${AppData}/plugins/nuclear-fake-plugin/0.1.0/index.ts`,
      );
    });

    await waitFor(() => {
      expect(
        PluginsWrapper.getPlugins().map((plugin) => ({
          name: plugin.name,
          description: plugin.description,
          author: plugin.author,
        })),
      ).toMatchInlineSnapshot(`
        [
          {
            "author": "by nukeop",
            "description": "Fake plugin for testing",
            "name": "Fake plugin",
          },
        ]
      `);
    });

    expect(PluginsWrapper.getPlugins()[0].enabled).toBe(false);
    await PluginsWrapper.getPlugins()[0].toggle();
    expect(PluginsWrapper.getPlugins()[0].enabled).toBe(true);
  });

  it('shows reload and remove actions for dev plugins', async () => {
    PluginDialogMock.setOpen('/dev/plugin');

    const readTextFileMock = PluginFsMock.setReadTextFile(fakePluginManifest);
    PluginFsMock.setExistsFor('plugins', AppData, true);

    const { usePluginStore } = await import('../../stores/pluginStore');

    await PluginsWrapper.mount();
    await userEvent.click(screen.getByText('Add Plugin'));

    await waitFor(() => {
      expect(readTextFileMock).toHaveBeenCalled();
    });

    const reloadButton = await screen.findByTestId('plugin-action-reload');
    const removeButton = await screen.findByTestId('plugin-action-remove');

    const reloadSpy = vi
      .spyOn(usePluginStore.getState(), 'reloadPlugin')
      .mockResolvedValue(undefined);
    const removeSpy = vi
      .spyOn(usePluginStore.getState(), 'removePlugin')
      .mockResolvedValue(undefined);

    try {
      await userEvent.click(reloadButton);
      expect(reloadSpy).toHaveBeenCalledWith('nuclear-fake-plugin');

      await userEvent.click(removeButton);
      expect(removeSpy).toHaveBeenCalledWith('nuclear-fake-plugin');
    } finally {
      reloadSpy.mockRestore();
      removeSpy.mockRestore();
    }
  });
});
