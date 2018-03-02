import Plugin from './plugin';

class MusicSourcePlugin extends Plugin {
  constructor() {
    super();
    this.name = 'Music Source Plugin';
    this.sourceName = 'Generic Music Source';
    this.description = 'A generic music source plugin. Should never be instantiated directly';
    this.image = null;
  }

  search(terms) {
    console.error('search not implemented in plugin ' + this.name);
  }

  getAlternateStream(terms, currentStream) {
    console.error('getAlternateStream not implemented in plugin ' + this.name);
  }

}

export default MusicSourcePlugin;
