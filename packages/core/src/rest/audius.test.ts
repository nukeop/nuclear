import _ from 'lodash';
import { rest } from '..';

const mockFetch = (data) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: jest.fn(() => ({
        data
      }))
    })
  ) as any;
};

const trackModel = {
  'data': {
    'artwork': {
      '150x150': 'string',
      '480x480': 'string',
      '1000x1000': 'string'
    },
    'description': 'string',
    'genre': 'string',
    'id': 'string',
    'mood': 'string',
    'release_date': 'string',
    'remix_of': {
      'tracks': [
        {
          'parent_track_id': 'string'
        }
      ]
    },
    'repost_count': 0,
    'favorite_count': 0,
    'tags': 'string',
    'title': 'string',
    'user': {
      'album_count': 0,
      'bio': 'string',
      'cover_photo': {
        '640x': 'string',
        '2000x': 'string'
      },
      'followee_count': 0,
      'follower_count': 0,
      'handle': 'string',
      'id': 'string',
      'is_verified': true,
      'location': 'string',
      'name': 'string',
      'playlist_count': 0,
      'profile_picture': {
        '150x150': 'string',
        '480x480': 'string',
        '1000x1000': 'string'
      },
      'repost_count': 0,
      'track_count': 0
    },
    'duration': 0,
    'downloadable': true,
    'play_count': 0,
    'permalink': 'string'
  }
};

describe('Audius tests', () => {
  beforeEach(() => {
    _.invoke(fetch, 'resetMocks');
  });

  it('audius host is selected', async () => {
    mockFetch(['1', '2', '3']);
    const endpoint = await rest.Audius._findHost();
    expect(endpoint.length > 0).toBe(true);
  });

  it('search artists', async () => {
    mockFetch('test');
    const endpoint = await rest.Audius._findHost();
    mockFetch([{ test: 'test data' }]);
    const response = await rest.Audius.artistSearch(endpoint, 'roto');
    const json = await response.json();
    expect(json.data).toEqual([{ test: 'test data'}]);
  });

  it('search tracks', async () => {
    mockFetch('test');
    const endpoint = await rest.Audius._findHost();
    mockFetch([{ test: 'test data' }]);
    const response = await rest.Audius.trackSearch(endpoint, 'roto');
    const json = await response.json();
    expect(json.data).toEqual([{ test: 'test data'}]);
  });

  it('get track by id', async () => {
    mockFetch('test');
    const endpoint = await rest.Audius._findHost();
    mockFetch(trackModel);
    const response = await rest.Audius.getTrack(endpoint, 'string');
    const json = await response.json();
    expect(json.data).toEqual(trackModel);
  });
});
