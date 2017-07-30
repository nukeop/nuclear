import MusicSourcePlugin from '../musicSources';

class YoutubePlugin extends MusicSourcePlugin {
  constructor() {
    super();
    this.name = 'Youtube Plugin';
    this.description = 'A plugin allowing nuclear to search for music and play it from youtube';
  }

  search(terms) {
    console.log('searching youtube for: ', terms);
    return Promise.resolve({});
  }
}

export default YoutubePlugin;
