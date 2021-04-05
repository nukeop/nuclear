import { rest } from '..';

describe('Audius tests', () => {
  it('audius host is selected', async () => {
    const endpoint = await rest.Audius._findHost();
    expect(endpoint.length > 0).toBe(true);
  });
  
  it('search artists', async () => {
    const endpoint = await rest.Audius._findHost();
    const response = await rest.Audius.artistSearch(endpoint, 'roto');
    const json = await response.json();
    expect(typeof json).toBe('object');
    expect(json.data instanceof Array).toBe(true);
    expect(json.data.length > 0).toBe(true);
  });
  
  it('search tracks', async () => {
    const endpoint = await rest.Audius._findHost();
    const response = await rest.Audius.trackSearch(endpoint, 'roto');
    const json = await response.json();
    expect(typeof json).toBe('object');
    expect(json.data instanceof Array).toBe(true);
    expect(json.data.length > 0).toBe(true);
  });  
});
