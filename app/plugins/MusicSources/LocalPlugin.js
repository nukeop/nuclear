import MusicSourcePlugin from '../musicSources';
import { localSearch } from '../../rest/Local';

class LocalPlugin extends MusicSourcePlugin {
  constructor() {
    super();
    this.name = 'Local Plugin';
    this.sourceName = 'Local';
    this.description = 'A plugin allowing Nuclear to search for music and play it local disk';
  }

  search(query) {
    return localSearch(query);
  }
}

export default LocalPlugin;
