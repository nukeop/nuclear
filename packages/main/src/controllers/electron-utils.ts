import { IpcEvents } from '@nuclear/core';
import { dialog, shell, clipboard, app } from 'electron';
import { inject } from 'inversify';
import { ipcController, ipcEvent, ipcInvokeHandler } from '../utils/decorators';
import Logger, { $mainLogger } from '../services/logger';
import Window from '../services/window';

interface PathPickerOptions {
  title?: string;
  defaultPath?: string;
  properties?: Array<'openDirectory' | 'multiSelections' | 'showHiddenFiles'>;
}

interface FilePickerOptions {
  title?: string;
  defaultPath?: string;
  filters?: { name: string; extensions: string[] }[];
  properties?: Array<'openFile' | 'multiSelections' | 'showHiddenFiles'>;
}

interface SaveDialogOptions {
  defaultPath?: string;
  filters?: { name: string; extensions: string[] }[];
  properties?: Array<'createDirectory' | 'showOverwriteConfirmation'>;
}

@ipcController()
class ElectronUtilsIpcCtrl {
  constructor(
    @inject($mainLogger) private logger: Logger,
    @inject(Window) private window: Window
  ) {}
  
  @ipcEvent(IpcEvents.DOWNLOAD_PAUSE)
  async onPauseDownload() {}

  @ipcInvokeHandler(IpcEvents.OPEN_PATH_PICKER)
  async openPathPicker(options: PathPickerOptions = {}) {
    try {
      const { filePaths } = await dialog.showOpenDialog(this.window.getBrowserWindow(), {
        title: options.title || 'Select Folder',
        defaultPath: options.defaultPath,
        properties: options.properties || ['openDirectory']
      });
      return filePaths;
    } catch (error) {
      this.logger.error('Failed to open path picker:', error);
      throw error;
    }
  }

  @ipcInvokeHandler(IpcEvents.OPEN_FILE_PICKER)
  async openFilePicker(options: FilePickerOptions = {}) {
    try {
      const { filePaths } = await dialog.showOpenDialog(this.window.getBrowserWindow(), {
        title: options.title || 'Select File',
        defaultPath: options.defaultPath,
        filters: options.filters,
        properties: options.properties || ['openFile']
      });
      return filePaths;
    } catch (error) {
      this.logger.error('Failed to open file picker:', error);
      throw error;
    }
  }

  @ipcInvokeHandler(IpcEvents.SHOW_SAVE_DIALOG)
  async showSaveDialog(options: SaveDialogOptions = {}) {
    try {
      const result = await dialog.showSaveDialog(this.window.getBrowserWindow(), {
        defaultPath: options.defaultPath,
        filters: options.filters,
        properties: options.properties
      });
      return result;
    } catch (error) {
      this.logger.error('Failed to open save dialog:', error);
      throw error;
    }
  }

  @ipcInvokeHandler(IpcEvents.OPEN_EXTERNAL_URL)
  async openExternalUrl(url: string) {
    try {
      await shell.openExternal(url);
      return true;
    } catch (error) {
      this.logger.error('Failed to open external URL:', error);
      throw error;
    }
  }

  @ipcInvokeHandler(IpcEvents.SHOW_ITEM_IN_FOLDER)
  async showItemInFolder(fullPath: string) {
    try {
      await shell.showItemInFolder(fullPath);
      return true;
    } catch (error) {
      this.logger.error('Failed to show item in folder:', error);
      throw error;
    }
  }

  @ipcInvokeHandler(IpcEvents.COPY_TO_CLIPBOARD)
  copyToClipboard(text: string) {
    try {
      clipboard.writeText(text);
      return true;
    } catch (error) {
      this.logger.error('Failed to copy to clipboard:', error);
      throw error;
    }
  }

  @ipcInvokeHandler(IpcEvents.GET_SYSTEM_INFO)
  getSystemInfo() {
    return {
      platform: process.platform,
      arch: process.arch,
      version: app.getVersion(),
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node,
      locale: app.getLocale(),
      paths: {
        userData: app.getPath('userData'),
        downloads: app.getPath('downloads'),
        documents: app.getPath('documents')
      }
    };
  }
}

export default ElectronUtilsIpcCtrl;
