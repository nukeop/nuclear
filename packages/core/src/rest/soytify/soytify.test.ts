/* eslint-disable no-console */
import { SoytifyClient } from './soytify-partners-api';

// These tests don't mock the API calls.
// The purpose is to be able to conveniently, manually test the API.
xdescribe('soytify test', () => {
  it('searchArtists', async () => {
    const client= new SoytifyClient();
    const data = await client.searchArtists('rush');
    console.log(JSON.stringify(data, null, 2));
  });

  it('searchTracks', async () => {
    const client= new SoytifyClient();
    const data = await client.searchTracks('rush');
    console.log(JSON.stringify(data, null, 2));
  });

  it('searchAll', async () => {
    const client= new SoytifyClient();
    const data = await client.searchAll('rush');
    console.log(JSON.stringify(data, null, 2));
  });

  it('fetchArtistDetails', async () => {
    const client= new SoytifyClient();
    const data = await client.fetchArtistDetails('spotify:artist:2Hkut4rAAyrQxRdof7FVJq');
    console.log(JSON.stringify(data, null, 2));
  });
});
