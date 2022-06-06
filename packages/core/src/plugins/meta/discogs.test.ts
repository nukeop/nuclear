import fetchMock from 'fetch-mock';
import fetch from 'node-fetch';

describe('discogs album tracks test', () => {

  beforeEach(() => {
    fetchMock.reset();
  });

  it('search for albums', async () => {
    
    fetchMock.getOnce('https://api.discogs.com/masters/115159', { tracklist: []});
    fetch('https://api.discogs.com/masters/115159').then(res => res.json()).then( json => {
      for (const track of json.tracklist) {
        expect(track.type_).toBe('track');
      }
    });
  });

});
