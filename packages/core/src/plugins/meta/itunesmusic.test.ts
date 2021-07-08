import iTunesMusicMetaProvider from './itunesmusic';
import * as iTunesMocks from './metaMocks/iTunesMusicMocks';
import Track from '../../structs/Track';

describe('iTunes music metaprovider tests', () => {
  it('search for artists', async () => {
    iTunesMocks.mockArtistResult();
    const itunesMeta = new iTunesMusicMetaProvider();
    const response = await itunesMeta.searchForArtists('Queen');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toEqual([
      {
        'coverImage': '',
        'id': 3296287,
        'name': 'Queen',
        'resourceUrl': 'https://music.apple.com/us/artist/queen/3296287?uo=4',
        'source': 'iTunesMusic',
        'thumb': ''
      }
    ]);
  });

  it('search for releases', async () => {
    iTunesMocks.mockAlbumResult();
    const itunesMeta = new iTunesMusicMetaProvider();
    const response = await itunesMeta.searchForReleases('The Platinum Collection (Greatest Hits I, II & III)');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toEqual([
      {
        'id': 1440650428,
        'coverImage': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/250x250bb.jpg',
        'thumb': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/1600x1600bb.jpg',
        'title': 'The Platinum Collection (Greatest Hits I, II & III)',
        'artist': 'Queen',
        'resourceUrl': 'https://music.apple.com/us/artist/queen/3296287?uo=4',
        'source': 'iTunesMusic'
      }
    ]);
  });

  it('search for tracks', async () => {
    iTunesMocks.mockTrackResult();
    const itunesMeta = new iTunesMusicMetaProvider();
    const response = await itunesMeta.searchForTracks('The Platinum Collection (Greatest Hits I, II & III)');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toEqual([
      {
        'id': 1440651216,
        'title': 'We Will Rock You',
        'artist': 'Queen',
        'source': 'iTunesMusic'
      }
    ]);
  });

  it('fetch artist albums', async () => {
    iTunesMocks.mockArtistAlbumsResult();
    const itunesMeta = new iTunesMusicMetaProvider();
    const response = await itunesMeta.fetchArtistAlbums('3296287');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toEqual([
      {
        'id': 1440650428,
        'coverImage': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/250x250bb.jpg',
        'thumb': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/1600x1600bb.jpg',
        'title': 'The Platinum Collection (Greatest Hits I, II & III)',
        'artist': 'Queen',
        'resourceUrl': 'https://music.apple.com/us/artist/queen/3296287?uo=4',
        'source': 'iTunesMusic'
      }
    ]);
  });

  it('fetch albums details', async () => {
    iTunesMocks.mockAlbumSongsSearch();
    const itunesMeta = new iTunesMusicMetaProvider();
    const response = await itunesMeta.fetchAlbumDetails('1440650428', 'master');
    expect(fetch).toHaveBeenCalledTimes(1);
    const track = new Track ({
      'artist': 'The Platinum Collection (Greatest Hits I, II & III)', 
      'duration': 356, 
      'position': 1, 
      'thumbnail': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/60x60bb.jpg', 
      'title': 'Bohemian Rhapsody'
    });
    track.uuid = '';
    response.tracklist[0].uuid = '';
    expect(response).toEqual({ 
      'artist': 'Queen', 
      'coverImage': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/250x250bb.jpg', 
      'id': 1440650428,
      'thumb': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/1600x1600bb.jpg', 
      'title': 'The Platinum Collection (Greatest Hits I, II & III)',
      'tracklist': [track], 
      'type': 'master', 
      'year': '2014-01-01T08:00:00Z'
    });
  });
});
