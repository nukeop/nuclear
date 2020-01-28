import Plugin from './plugin';

abstract class LyricsProvider extends Plugin {
  sourceName: string;

  abstract search(artistName: string, trackName: string): string;
}

export default LyricsProvider;
