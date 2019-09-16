import { describe, it } from 'mocha';
import { expect } from 'chai';

import { removeQuotes, createLastFMLink } from '../app/utils';

describe('utils', () => {
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
      expect(createLastFMLink('nǽnøĉÿbbœrğ vbëřřħōlökäävsŧ'))
        .to.be.string('https://www.last.fm/music/n%C7%BDn%C3%B8%C4%89%C3%BFbb%C5%93r%C4%9F+vb%C3%AB%C5%99%C5%99%C4%A7%C5%8Dl%C3%B6k%C3%A4%C3%A4vs%C5%A7');
    });

    it('creates a link with an artists and track', () => {
      expect(createLastFMLink('Die Ärzte', 'Schrei nach Liebe'))
        .to.be.string('https://www.last.fm/music/Die+%C3%84rzte/_/Schrei+nach+Liebe');
      expect(createLastFMLink('Godspeed You! Black Emperor', 'Bosses Hang, Pt. I'))
        .to.be.string('https://www.last.fm/music/Godspeed+You!+Black+Emperor/_/Bosses+Hang%2C+Pt.+I');
    });

    it('throwns an error in case of missing artist', () => {
      expect(() => createLastFMLink()).to.throw('"createLastFMLink" function requires at least "artist" argument');
    });
  });
});
