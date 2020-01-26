import Plugin from './plugin';

interface LyricsProvider extends Plugin {
  sourceName: string;

  search(artistName: string, trackName: string): string;
}

export default LyricsProvider;
