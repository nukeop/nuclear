import 'isomorphic-fetch';
import { Bandcamp } from '.';

describe('Bandcamp tests', () => {
  it('search', async () => {
    const result = await Bandcamp.search('swans');
    expect(result.length > 0).toBe(true);
  });
  
  it('get album info', async () => {
    const result = await Bandcamp.getAlbumInfo('https://swans.bandcamp.com/album/the-seer');
    expect(result.tracks.length === 11).toBe(true);
    expect(result.artist).toBe('SWANS');
    expect(result.title).toBe('The Seer');
    expect(result.imageUrl).toBe('https://f4.bcbits.com/img/a3233794906_2.jpg');
    expect(result.url).toBe('https://swans.bandcamp.com/album/the-seer');
  });
  
  it('get track stream', async () => {
    const { duration, stream } = await Bandcamp.getTrackData('https://swans.bandcamp.com/track/apostate');
    expect(stream.length).toBeGreaterThan(0);
    expect(stream.includes('https')).toBe(true);
    expect(stream.includes('stream')).toBe(true);
    expect(stream.includes('mp3-128')).toBe(true);
    expect(duration).toBeGreaterThan(0);
  });
});
