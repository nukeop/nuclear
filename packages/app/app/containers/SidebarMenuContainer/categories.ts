import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';

type MenuItem = {
    name: string;
    path: string;
    icon: SemanticICONS;
}

type Category = {
    name: string;
    items: MenuItem[];
}

export default [
  {
    name: 'main',
    items: [
      { name: 'dashboard', path: 'dashboard', icon: 'dashboard' },
      { name: 'downloads', path: 'downloads', icon: 'download' },
      { name: 'lyrics', path: 'lyrics', icon: 'microphone' },
      { name: 'plugins', path: 'plugins', icon: 'flask' },
      { name: 'search', path: 'search', icon: 'search' },
      { name: 'settings', path: 'settings', icon: 'cog' },
      { name: 'equalizer', path: 'equalizer', icon: 'align right' },
      { name: 'visualizer', path: 'visualizer', icon: 'tint' }
    ]
  }, {
    name: 'collection',
    items: [
      { name: 'favorite-albums', path: 'favorites/albums', icon: 'dot circle' },
      { name: 'favorite-tracks', path: 'favorites/tracks', icon: 'music' },
      { name: 'favorite-artists', path: 'favorites/artists', icon: 'user' },
      { name: 'library', path: 'library', icon: 'file audio outline' },
      { name: 'playlists', path: 'playlists', icon: 'list alternate outline' }
    ]
  }
] as Category[];
