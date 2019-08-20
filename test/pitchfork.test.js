import {
  getBestNewAlbums,
  getBestNewTracks
} from 'pitchfork-bnm';

describe('Pitchfork API tests', () => {
  it('gets best new albums', async () => {
    const result = await getBestNewAlbums();
    expect(typeof result).toBe('array');
    result.forEach(entry => {
      expect(typeof entry).toBe('object');
      expect(Object.keys(entry)).toEqual(expect.arrayContaining([
        'thumbnail',
        'artist',
        'title',
        'reviewUrl',
        'genres',
        'score',
        'abstract',
        'review'
      ]));
    });
  });

  it('gets best new tracks', async () => {
    const result = await getBestNewTracks();
    expect(typeof result).toBe('array');
    result.forEach(entry => {
      expect(typeof entry).toBe('object');
      expect(Object.keys(entry)).toEqual(expect.arrayContaining([
        'thumbnail',
        'artist',
        'title',
        'reviewUrl',
        'review'
      ])); 
    });
  });
});
