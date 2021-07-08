import iTunesPodcastMetaProvider from './itunespodcast';
import * as iTunesMocks from './metaMocks/iTunesPodcastMocks';
import { Track } from '../..';

describe('iTunes podcast metaprovider tests', () => {
  it('search for podcasts', async () => {
    iTunesMocks.mockPodcastResult();
    const itunesMeta = new iTunesPodcastMetaProvider();
    const response = await itunesMeta.searchForPodcast('Programming Throwdown');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toEqual([
      {
        'id': 427166321,
        'coverImage': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/600x600bb.jpg',
        'thumb': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/600x600bb.jpg',
        'title': 'Programming Throwdown',
        'author': 'Patrick Wheeler and Jason Gauci',
        'type': 'podcast',
        'source': 'iTunesPodcast'
      }
    ]);
  });

  it('search for podcasts details', async () => {
    iTunesMocks.mockPodcastEpisodesResult();
    const itunesMeta = new iTunesPodcastMetaProvider();
    const response = await itunesMeta.fetchAlbumDetails('Programming Throwdown');
    expect(fetch).toHaveBeenCalledTimes(1);
    const track = new Track ({
      'artist': 'Programming Throwdown', 
      'duration': 4554, 
      'position': 1, 
      'thumbnail': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/60x60bb.jpg', 
      'title': 'Route Planning with Parker Woodward'
    });
    track.uuid = '';
    response.tracklist[0].uuid = '';
    expect(response).toEqual({ 
      'artist': 'Programming Throwdown', 
      'coverImage': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/600x600bb.jpg', 
      'id': 427166321,
      'thumb': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/600x600bb.jpg', 
      'title': 'Programming Throwdown',
      'tracklist': [track], 
      'type': 'master', 
      'year': '2021-07-07T17:08:00Z'
    });
  });
});
