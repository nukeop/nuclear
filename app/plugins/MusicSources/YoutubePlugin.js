import MusicSourcePlugin from '../musicSources';
import * as Youtube from '../../rest/Youtube';

class YoutubePlugin extends MusicSourcePlugin {
  constructor() {
    super();
    this.name = 'Youtube Plugin';
    this.description = 'A plugin allowing nuclear to search for music and play it from youtube';
  }

  search(terms) {
    return Youtube.trackSearch(terms)
    .then(results => results.json())
    .then(results => results.items);
  }
}

export default YoutubePlugin;
