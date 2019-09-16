import { describe, it } from 'mocha';
import { expect } from 'chai';

import { getFavoriteTrack, getFavoriteAlbum } from '../../app/selectors/favorites';

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
    ],
    albums: [{
      title: 'Runter mit den Spendierhosen, Unsichtbarer!',
      artists: [{
        name: 'Die Ärzte'
      }]
    }, {
      title: 'Emily Alone',
      artists: [{
        name: 'Florist (2)'
      }]
    }]
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

  describe('getFavoriteAlbum', () => {
    it('returns null in case of invalid params', () => {
      expect(getFavoriteAlbum(state)).to.be.null;
      expect(getFavoriteAlbum(state, 'Die Ärzte')).to.be.null;
      expect(getFavoriteAlbum(state, '', 'Runter mit den Spendierhosen, Unsichtbarer!')).to.be.null;
    });

    it('returns undefined in case params not matching state', () => {
      expect(getFavoriteAlbum(state, 'Nirvana', 'In Utero')).to.be.undefined;
    });

    it('returns album in case of params matching state', () => {
      expect(getFavoriteAlbum(state, 'Die Ärzte', 'Runter mit den Spendierhosen, Unsichtbarer!')).to.eql({
        title: 'Runter mit den Spendierhosen, Unsichtbarer!',
        artists: [{
          name: 'Die Ärzte'
        }]
      });
    });

    it('returns album in case of params matching (regardless case and accent) state', () => {
      expect(getFavoriteAlbum(state, 'die arzte', 'RUNTER MIT DEN SPENDIERHOSEN, UNSICHTBARER!')).to.eql({
        title: 'Runter mit den Spendierhosen, Unsichtbarer!',
        artists: [{
          name: 'Die Ärzte'
        }]
      });
    });

    it('returns album in case of params matching (regardless artist quantifier with parentheses) state', () => {
      expect(getFavoriteAlbum(state, 'Florist', 'Emily Alone')).to.eql({
        title: 'Emily Alone',
        artists: [{
          name: 'Florist (2)'
        }]
      });
    });
  });
});
