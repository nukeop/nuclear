import { soundcloudSearch } from '../app/rest/Soundcloud';

describe('Soundcloud REST API tests', () => {
  it.skip('performs a basic search', async () => {
    const data = await soundcloudSearch('death grips - get got');
    const results = data.json();
    expect(results[0]).to.be.an('object').that.includes.all.keys('id', 'title', 'duration', 'stream_url');  
  });
});
