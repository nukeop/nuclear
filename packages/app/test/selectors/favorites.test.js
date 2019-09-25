import { describe, it } from 'mocha';
import { expect } from 'chai';

import { getFavoriteTrack } from '../../app/selectors/favorites';

const state = {
  favorites: {
    tracks: [
      {
        artist: {
          name: 'Queen'
        },
        name: 'Bohemian Rhapsody'
      },
      {
        artist: {
          name: 'Die Ärzte'
        },
        name: 'Schrei nach Liebe'
      }
    ]
  }
};

describe('selectors / favorites', () => {

  describe('getFavoriteTrack', () => {
    it('returns null in case of invalid params', () => {
      expect(getFavoriteTrack(state)).to.be.null;
      expect(getFavoriteTrack(state, 'Queen')).to.be.null;
      expect(getFavoriteTrack(state, '', 'Bohemian Rhapsody')).to.be.null;
    });

    it('returns undefined in case params not matching state', () => {
      expect(getFavoriteTrack(state, 'Metallica', 'Enter Sandman')).to.be.undefined;
    });

    it('returns track in case of params matching state', () => {
      expect(getFavoriteTrack(state, 'Queen', 'Bohemian Rhapsody')).to.eql({
        artist: {
          name: 'Queen'
        },
        name: 'Bohemian Rhapsody'
      });
    });

    it('returns track in case of params matching (regardless case and accent) state', () => {
      expect(getFavoriteTrack(state, 'die arzte', 'SCHREI NACH LIEBE')).to.eql({
        artist: {
          name: 'Die Ärzte'
        },
        name: 'Schrei nach Liebe'
      });
    });
  });
});
