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
});
