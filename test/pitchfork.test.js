import {
  getBestNewAlbums,
  getBestNewTracks
} from 'pitchfork-bnm';

describe('Pitchfork API tests', () => {
  it('gets best new albums', async () => {
    const result = await getBestNewAlbums();
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
