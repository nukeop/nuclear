import {
  getBestNewAlbums,
  getBestNewTracks
} from 'pitchfork-bnm';
import { expect } from 'chai';

describe('Pitchfork API tests', () => {
  it('gets best new albums', () => {
    getBestNewAlbums().
      then(albums => {
        
      })
      .catch(error => {
        console.error(error);
        expect(false).to.equal(true);
      });
  });

  it('gets best new tracks', () => {
    getBestNewTracks().
      then(tracks => {
        
      })
      .catch(error => {
        console.error(error);
        expect(false).to.equal(true);
      });
  });
});
