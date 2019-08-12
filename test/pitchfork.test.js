import {
  getBestNewAlbums,
  getBestNewTracks
} from 'pitchfork-bnm';

describe('Pitchfork API tests', () => {
  it('gets best new albums', async () => {
    const result = await getBestNewAlbums()
      .then(albums => {
        return albums;
      })
      .catch(error => {
        console.error(error);
        expect(false).to.equal(true);
      });

    expect(result).to.be.an('array');
    result.forEach(entry => {
      expect(entry).to.be.an('object').that.has.all.keys(
        'thumbnail',
        'artist',
        'title',
        'reviewUrl',
        'genres',
        'score',
        'abstract',
        'review');
    });
  });

  it('gets best new tracks', async () => {
    const result = await getBestNewTracks();
    expect(typeof result).toBe('array');
    result.forEach(entry => {
      expect(typeof entry).toBe('object');
      expect(new Set(Object.keys(entry))).toEqual(new Set([
        'thumbnail',
        'artist',
        'title',
        'reviewUrl',
        'review'])
      ); 
    });
  });
});
