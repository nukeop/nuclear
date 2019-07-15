import { soundcloudSearch } from '../app/rest/Soundcloud';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Soundcloud REST API tests', () => {
  it('performs a basic search', () => {
    soundcloudSearch('death grips - get got')
      .then(data => data.json())
      .then(results => {
        expect(results[0]).to.be.an('object').that.includes.all.keys('id', 'title', 'duration', 'stream_url');
      })
      .catch(err => {
        console.error(err);
      });
  });
});
