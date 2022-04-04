import { rest } from '..';
const youtubeService = rest.Youtube;

const playlistLessThan100 = 'https://www.youtube.com/watch?v=TKYsuU86-DQ&list=PL0eyrZgxdwhwNC5ppZo_dYGVjerQY3xYU';

const playlistGreaterThan100 = 'https://www.youtube.com/playlist?list=PLuUrokoVSxlcgocBXbDF76yWd3YKWpOH9';

describe('Youtube tests', () => {
  it('should able to get playlist less than 100 tracks', async () => {
    const tracks = await youtubeService.handleYoutubePlaylist(playlistLessThan100);
    expect(tracks.length).toBeGreaterThan(0);

    const oneTrack = tracks[0];
    expect(oneTrack.name.length).not.toEqual(0);
    expect(oneTrack.thumbnail.length).not.toEqual(0);
    expect(oneTrack.artist.length).not.toEqual(0);
    expect(oneTrack.streams.length).toEqual(1);
    expect(oneTrack.streams[0].id.length).not.toEqual(0);
    expect(oneTrack.streams[0].source).toBe('Youtube');
  });

  it('should able to get playlist more than 100 track', async () => {
    const tracks = await youtubeService.handleYoutubePlaylist(playlistGreaterThan100);
    expect(tracks.length).toBeGreaterThan(100);

    const oneTrack = tracks[0];
    expect(oneTrack.name.length).not.toEqual(0);
    expect(oneTrack.thumbnail.length).not.toEqual(0);
    expect(oneTrack.artist.length).not.toEqual(0);
    expect(oneTrack.streams.length).toEqual(1);
    expect(oneTrack.streams[0].id.length).not.toEqual(0);
    expect(oneTrack.streams[0].source).toBe('Youtube');
  });

  it('should return empty array if the url is invalid', async () => {
    const tracks = await youtubeService.handleYoutubePlaylist('invalid url');
    expect(tracks).toHaveLength(0);
  });
});
