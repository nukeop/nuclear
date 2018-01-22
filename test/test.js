import assert from 'assert';
import { expect } from 'chai';

var billboard = require('../app/rest/Billboard');

describe('Billboard api tests', () => {
  it('tests exports', () => {
    expect(billboard).to.be.an('object');
    expect(billboard).to.have.property('getTop');
    expect(billboard).to.have.property('lists');
  });

  it('gets a pop songs list', () => {
    billboard.getTop(billboard.lists.genres[0].link)
      .then(songs => {
	expect(songs).to.be.an('array').that.has.lengthOf(40);
      })
      .catch(err => {
	console.error(err);
      });
  });
});
