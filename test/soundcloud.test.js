import { soundcloudSearch } from '../app/rest/Soundcloud';

describe('Soundcloud REST API tests', () => {
  it('performs a basic search', async () => {
    const data = await soundcloudSearch('death grips - get got');
    const results = data.json();
    expect(typeof results[0]).toBe('object');
    expect(results[0]).toEqual(expect.arrayContaining(['id', 'title', 'duration', 'stream_url']));  
  });
});
