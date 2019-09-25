import StreamProviderPlugin from '../streamProvider';
import { localSearch } from '../../rest/Local';

class LocalPlugin extends StreamProviderPlugin {
  constructor() {
    super();
    this.name = 'Local Plugin';
    this.sourceName = 'Local';
    this.description = 'A plugin allowing Nuclear to search for music and play it local disk';
  }

  search(query) {
    return localSearch(query);
  }

  getAlternateStream(query) {
    return localSearch(query);
  }
}

export default LocalPlugin;
