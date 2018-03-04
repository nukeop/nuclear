import MusicSourcePlugin from '../musicSources';

class SoundcloudPlugin extends MusicSourcePlugin {
  constructor() {
    super();
    this.name = 'Soundcloud Plugin';
    this.sourceName = 'Soundcloud';
    this.description = 'Allows Nuclear to find music streams on Soundcloud';
  }

  search(terms) {

  }

  getAlternateStream(terms, currentStream) {

  }
}

export default SoundcloudPlugin;
