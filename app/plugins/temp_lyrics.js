import Plugin from './plugin';

class LyricsPlugin extends Plugin {
  constructor() {
    super();
    this.name = 'Lyrics  Plugin';
    this.sourceName = 'Generic Lyric';
    this.description = 'A generic lyric plugin. Should never be instantiated directly';
    this.image = null;
  }

  search (terms) {
    console.error('search not implemented in plugin ' + this.name);
  }


}

export default LyricsPlugin;
