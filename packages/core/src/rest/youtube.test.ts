
import { rest } from '..';
jest.mock('@electron/remote', () => ({
  exec: jest.fn(),
  getGlobal: jest.fn().mockReturnValue({})
}));

// Add mocks to avoid network requests
jest.mock('@distube/ytpl', () => {
  const mockGetPlaylistID = jest.fn((url: string) => {
    if (url.includes('TKYsuU86-DQ')) {
      return 'playlistLessThan100';
    }
    if (url.includes('PL8F6B0753B2CCA128')) {
      return 'playlistGreaterThan100';
    }
    if (url.includes('PLEUdk8hER43Uc7d2TWCW0HgQj8MEnC3Yq')) {
      return 'playlistWithMoreThan512Tracks';
    }
    return '';
  });
  const mockValidateID = jest.fn(() => true);
  const mockYtpl = jest.fn((playlistId: string) => {
    if (playlistId === 'playlistLessThan100') {
      return Promise.resolve({
        items: new Array(50).fill(null).map((_, i) => ({
          id: `less-${i}`,
          title: `Less Track ${i}`,
          thumbnail: 'http://thumbnail-less',
          author: { name: 'Artist Less' }
        }))
      });
    } else if (playlistId === 'playlistGreaterThan100') {
      return Promise.resolve({
        items: new Array(101).fill(null).map((_, i) => ({
          id: `greater-${i}`,
          title: `Greater Track ${i}`,
          thumbnail: 'http://thumbnail-greater',
          author: { name: 'Artist Greater' }
        }))
      });
    } else if (playlistId === 'playlistWithMoreThan512Tracks') {
      return Promise.resolve({
        items: new Array(1134).fill(null).map((_, i) => ({
          id: `more-${i}`,
          title: `More Track ${i}`,
          thumbnail: 'http://thumbnail-more',
          author: { name: 'Artist More' }
        }))
      });
    }
    return Promise.resolve({ items: [] });
  });
  return Object.assign(mockYtpl, {
    getPlaylistID: mockGetPlaylistID,
    validateID: mockValidateID
  });
});

jest.mock('@nuclearplayer/ytdl-core', () => ({
  createAgent: jest.fn(),
  getInfo: jest.fn().mockResolvedValue({
    videoDetails: {
      videoId: 'dummy',
      title: 'dummy video',
      thumbnails: [{ url: 'http://dummy', width: 100, height: 100 }],
      ownerChannelName: 'dummy',
      lengthSeconds: '100',
      author: { name: 'dummy', thumbnails: [{ url: 'http://dummy', width: 100, height: 100 }] }
    },
    formats: []
  }),
  chooseFormat: jest.fn().mockReturnValue({
    url: 'http://dummy',
    container: 'mp4',
    isLive: false
  })
}));

jest.mock('@distube/ytsr', () => jest.fn());


const youtubeService = rest.Youtube;

const playlistLessThan100 =
  'https://www.youtube.com/watch?v=TKYsuU86-DQ&list=PL0eyrZgxdwhwNC5ppZo_dYGVjerQY3xYU';
const playlistGreaterThan100 =
  'https://www.youtube.com/playlist?list=PL8F6B0753B2CCA128';
const playlistWithMoreThan512Tracks =
  'https://www.youtube.com/playlist?list=PLEUdk8hER43Uc7d2TWCW0HgQj8MEnC3Yq';

describe('Youtube tests', () => {
  it('should get a playlist with less than 100 tracks', async () => {
    const tracks = await youtubeService.handleYoutubePlaylist(playlistLessThan100);
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
    const tracks = await youtubeService.handleYoutubePlaylist(playlistGreaterThan100);
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
    const tracks = await youtubeService.handleYoutubePlaylist(playlistWithMoreThan512Tracks);
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
