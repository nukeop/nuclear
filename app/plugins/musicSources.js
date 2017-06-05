import Plugin from './Plugin';

class MusicSourcePlugin extends Plugin {
  constructor() {
    super();
    this.name = 'Music Source Plugin';
    this.description = 'A generic music source plugin. Should never be instantiated directly';
  }

  search(artist, track) {
    console.error('search not implemented in plugin ' + this.name);
  }

}
