import { describe, it } from 'mocha';
import { expect } from 'chai';

import { removeQuotes, createLastFMLink } from '../app/utils';

describe('Utils', () => {
  describe('removeQuotes', () => {
    it('handles non-string values', () => {
      expect(removeQuotes(1)).to.be.string('1');
      expect(removeQuotes(null)).to.be.string('null');
      expect(removeQuotes(NaN)).to.be.string('NaN');
    });

    it('handles string values', () => {
      expect(removeQuotes('ab')).to.be.string('ab');
      expect(removeQuotes('a“”b')).to.be.string('ab');
      expect(removeQuotes('“”ab“”')).to.be.string('ab');
    });
  });

  describe('createLastFMLink', () => {
    it('creates a link with an artist', () => {
      expect(createLastFMLink('Hüsker Dü')).to.be.string('https://www.last.fm/music/H%C3%BCsker+D%C3%BC');
    });

    it('creates a link with an artists and track', () => {
      expect(createLastFMLink('Die Ärzte', 'Schrei nach Liebe'))
        .to.be.string('https://www.last.fm/music/Die+%C3%84rzte/_/Schrei+nach+Liebe');
    });

    it('throwns an error in case of missing artist', () => {
      expect(() => createLastFMLink()).to.throw('"createLastFMLink" function requires at least "artist" argument');
    });
  });
});
