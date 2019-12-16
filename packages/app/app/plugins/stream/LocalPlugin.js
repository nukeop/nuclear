import { ipcRenderer } from 'electron';

import StreamProviderPlugin from '../streamProvider';

class LocalPlugin extends StreamProviderPlugin {
  constructor() {
    super();
    this.name = 'Local Plugin';
    this.sourceName = 'Local';
    this.description = 'A plugin allowing Nuclear to search for music and play it local disk';
  }

  search(query) {
    return ipcRenderer.sendSync('local-search', query);
  }

  getAlternateStream(query) {
    return this.search(query);
  }
}

export default LocalPlugin;
