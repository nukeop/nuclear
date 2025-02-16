import { rest } from '..';

jest.mock('@electron/remote', () => ({
  exec: jest.fn(),
  getGlobal: jest.fn().mockReturnValue({})
}));

// TODO: replace these tests with mocks
const youtubeService = rest.Youtube;

const playlistLessThan100 =
  'https://www.youtube.com/watch?v=TKYsuU86-DQ&list=PL0eyrZgxdwhwNC5ppZo_dYGVjerQY3xYU';

const playlistGreaterThan100 =
  'https://www.youtube.com/playlist?list=PL8F6B0753B2CCA128';

const playlistWithMoreThan512Tracks = 'https://www.youtube.com/playlist?list=PLEUdk8hER43Uc7d2TWCW0HgQj8MEnC3Yq';

describe('Youtube tests', () => {
  it('should get a playlist with less than 100 tracks', async () => {
    const tracks = await youtubeService.handleYoutubePlaylist(
      playlistLessThan100
    );
    expect(tracks.length).toBeGreaterThan(0);

    const oneTrack = tracks[0];
    expect(oneTrack.name.length).not.toEqual(0);
    expect(oneTrack.thumbnail.length).not.toEqual(0);
    expect(oneTrack.artist).toBeDefined();
    expect(oneTrack.streams.length).toEqual(1);
    expect(oneTrack.streams[0].id.length).not.toEqual(0);
    expect(oneTrack.streams[0].source).toBe('Youtube');
  });

  it('should get a playlist with more than 100 tracks', async () => {
    const tracks = await youtubeService.handleYoutubePlaylist(
      playlistGreaterThan100
    );
    expect(tracks.length).toBeGreaterThan(100);

    const oneTrack = tracks[0];
    expect(oneTrack.name.length).not.toEqual(0);
    expect(oneTrack.thumbnail.length).not.toEqual(0);
    expect(oneTrack.artist).toBeDefined();
    expect(oneTrack.streams.length).toEqual(1);
    expect(oneTrack.streams[0].id.length).not.toEqual(0);
    expect(oneTrack.streams[0].source).toBe('Youtube');
  });

  it('should return empty array if the url is invalid', async () => {
    const tracks = await youtubeService.handleYoutubePlaylist('invalid url');
    expect(tracks).toHaveLength(0);
  });

  it('should get a playlist with more than 512 tracks', async () => {
    const tracks = await youtubeService.handleYoutubePlaylist(
      playlistWithMoreThan512Tracks
    );
    expect(tracks.length).toBe(1134);

    const oneTrack = tracks[0];
    expect(oneTrack.name.length).not.toEqual(0);
    expect(oneTrack.thumbnail.length).not.toEqual(0);
    expect(oneTrack.artist).toBeDefined();
    expect(oneTrack.streams.length).toEqual(1);
    expect(oneTrack.streams[0].id.length).not.toEqual(0);
    expect(oneTrack.streams[0].source).toBe('Youtube');
  });
});
