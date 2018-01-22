require('isomorphic-fetch');
import assert from 'assert';
import { expect } from 'chai';

var billboard = require('../app/rest/Billboard');
var lastfm = require('../app/rest/Lastfm');

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

describe('Last.fm api tests', () => {
  it('tests exports', () => {
    expect(lastfm).to.be.an('object');
  });

  it('tests getting top tags', () => {
    lastfm.getTopTags()
      .then(response => response.json())
      .then(results => {
	expect(results).to.be.an('object').that.has.nested.property('toptags.tag');
	var sample = results.toptags.tag[0];
	expect(sample).to.be.an('object').that.has.all.keys('name', 'count', 'reach');
      });
  });

  it('tests getting a tag\'s top tracks', () => {
    lastfm.getTopTagTracks('indie')
      .then(response => response.json())
      .then(results => {
	expect(results).to.be.an('object').that.has.nested.property('tracks.track');
	var sample = results.tracks.track[0];
	expect(sample).to.be.an('object').that.has.all.keys(
	  'name',
	  'artist',
	  'duration',
	  'streamable',
	  'mbid',
	  'url',
	  'image',
	  '@attr'
	);
      })
      .catch(err => {
	console.error(err);
      });
  });


});
