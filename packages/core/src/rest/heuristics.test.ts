import { SearchVideo } from 'youtube-ext';
import { YoutubeHeuristics } from './heuristics';

export const ytTrack = (overrides?: Partial<SearchVideo>): Partial<SearchVideo> => ({
  title: 'Black Sabbath - Paranoid',
  channel: {
    name: 'Black Sabbath'
  } as SearchVideo['channel'],
  duration: { text: '172', pretty: '2:12' },
  ...overrides
});

describe('Search heuristics', () => {
  it('finds a verbatim match', () => {
    const tracks = [
      ytTrack({
        title: 'Ozzy Osbourne - Crazy Train'
      }),
      ytTrack({
        title: 'Frank Zappa - Muffin Man'
      }),
      ytTrack({
        title: 'Black Sabbath - Paranoid'
      }),
      ytTrack({
        title: 'The White Stripes - Seven Nation Army'
      })
    ];

    const heuristics = new YoutubeHeuristics();
    const orderedTracks = heuristics.orderTracks({
      tracks,
      artist: 'Black Sabbath',
      title: 'Paranoid'
    });

    expect(orderedTracks[0]).toEqual(tracks[2]);
  });

  it('prefers titles that contain the artist and title verbatim', () => {
    const tracks = [
      ytTrack({
        title: 'Rammstein - Zick Zack (Official Video)'
      }),
      ytTrack({
        title: 'Rammstein - Zeit (Official Video)'
      }),
      ytTrack({
        title: 'Rammstein - Zeig Dich (Official Lyric Video)'
      })
    ];

    const heuristics = new YoutubeHeuristics();
    const orderedTracks = heuristics.orderTracks({
      tracks,
      artist: 'Rammstein',
      title: 'Zeig Dich'
    });
    
    expect(orderedTracks[0]).toEqual(tracks[2]);
  });


  it('prefers a closer match in case of a partial match', () => {
    const tracks = [
      ytTrack({
        title: 'Johnny Cash - The Mercy Seat'
      }),
      ytTrack({
        title: 'Nick Cave - The Mercy Seat'
      })
    ];
      
    const heuristics = new YoutubeHeuristics();
    const orderedTracks = heuristics.orderTracks({
      tracks,
      artist: 'Nick Cave & The Bad Seeds',
      title: 'The Mercy Seat'
    });
    expect(orderedTracks[0]).toEqual(tracks[1]);
  });

  it('tolerates typos', () => {
    const tracks = [
      ytTrack({
        title: 'The Whte Stipes - Sevn Natn Ary'
      }),
      ytTrack({
        title: 'The Whte Stripes - Sevn Nation Army'
      }),
      ytTrack({
        title: 'Arctic Monkeys - Do I Wanna Know'
      })
    ];

    const heuristics = new YoutubeHeuristics();
    const orderedTracks = heuristics.orderTracks({
      tracks,
      artist: 'The White Stripes',
      title: 'Seven Nation Army'
    });
    expect(orderedTracks).toEqual([
      tracks[1],
      tracks[0],
      tracks[2]
    ]);

  });

  it('prefers an official video', () => {
    const tracks = [
      ytTrack({
        title: 'Ozzy Osbourne - Crazy Train (crappy bootleg)'
      }),
      ytTrack({
        title: 'Ozzy Osbourne - Crazy Train - Official Video'
      })
    ];

    const heuristics = new YoutubeHeuristics();
    const orderedTracks = heuristics.orderTracks({
      tracks,
      artist: 'Ozzy Osbourne',
      title: 'Crazy Train'
    });

    expect(orderedTracks[0]).toEqual(tracks[1]);
  });

  it('prefers high quality videos', () => {
    const tracks = [
      ytTrack({
        title: 'Ozzy Osbourne - Crazy Train (crappy bootleg)'
      }),
      ytTrack({
        title: 'Ozzy Osbourne - Crazy Train (HQ)'
      }),
      ytTrack({
        title: 'Ozzy Osbourne - Crazy Train - High Quality'
      })
    ];

    const heuristics = new YoutubeHeuristics();
    const orderedTracks = heuristics.orderTracks({
      tracks,
      artist: 'Ozzy Osbourne',
      title: 'Crazy Train'
    });

    expect(orderedTracks).toEqual([
      tracks[1],
      tracks[2],
      tracks[0]
    ]);
  });

  it('prefers videos with closest duration', () => {
    const tracks = [
      ytTrack({
        title: 'Frank Zappa - Peaches en Regalia',
        duration: { text: '180', pretty: '3:00' }
      }),
      ytTrack({
        title: 'Frank Zappa - Peaches en Regalia',
        duration: { text: '219', pretty: '3:39' }
      }),
      ytTrack({
        title: 'Frank Zappa - Peaches en Regalia',
        duration: { text: '300', pretty: '5:00' }
      }),
      ytTrack({
        title: 'Frank Zappa - Peaches en Regalia',
        duration: { text: '360', pretty: '6:00' }
      })
    ];

    const heuristics = new YoutubeHeuristics();
    const orderedTracks = heuristics.orderTracks({
      tracks,
      artist: 'Frank Zappa',
      title: 'Peaches en Regalia',
      duration: 219
    });

    expect(orderedTracks).toEqual([
      tracks[1],
      tracks[0],
      tracks[2],
      tracks[3]
    ]);
  });

  it('ranks videos with full albums lower', () => {
    const tracks = [
      ytTrack({
        title: 'Black Sabbath - Paranoid (Full album)'
      }),
      ytTrack({
        title: 'Black Sabbath - Paranoid (random addition to the title)'
      })
    ];

    const heuristics = new YoutubeHeuristics();
    const orderedTracks = heuristics.orderTracks({
      tracks,
      artist: 'Black Sabbath',
      title: 'Paranoid'
    });

    expect(orderedTracks).toEqual([
      tracks[1],
      tracks[0]
    ]);
  });

  it('ranks live videos lower', () => {
    const tracks = [
      ytTrack({
        title: 'Black Sabbath - Paranoid (Live)'
      }),
      ytTrack({
        title: 'Black Sabbath - Paranoid (Something else)'
      })
    ];

    const heuristics = new YoutubeHeuristics();
    const orderedTracks = heuristics.orderTracks({
      tracks,
      artist: 'Black Sabbath',
      title: 'Paranoid'
    });

    expect(orderedTracks).toEqual([
      tracks[1],
      tracks[0]
    ]);
  });
  it('ranks live videos normally if they also appear in the search query title', () => {
    const tracks = [
      ytTrack({
        title: 'Black Sabbath - Paranoid'
      }),
      ytTrack({
        title: 'Black Sabbath - Paranoid (Live)'
      }),
      ytTrack({
        title: 'Black Sabbath - Paranoid (Random addition to the title)'
      })
    ];

    const heuristics = new YoutubeHeuristics();
    const orderedTracks = heuristics.orderTracks({
      tracks,
      artist: 'Black Sabbath',
      title: 'Paranoid (Live)'
    });

    expect(orderedTracks).toEqual([
      tracks[1],
      tracks[0],
      tracks[2]
    ]);
  });

  it('ranks remix videos lower', () => {
    const tracks = [
      ytTrack({
        title: 'Black Sabbath - Paranoid (Remix)'
      }),
      ytTrack({
        title: 'Black Sabbath - Paranoid (Random addition to the title)'
      })
    ];

    const heuristics = new YoutubeHeuristics();
    const orderedTracks = heuristics.orderTracks({
      tracks,
      artist: 'Black Sabbath',
      title: 'Paranoid'
    });

    expect(orderedTracks).toEqual([
      tracks[1],
      tracks[0]
    ]);
  });


  it('ranks videos whose channel names include the artist name higher', () => {
    const tracks = [
      ytTrack({
        title: 'Savant - Valkyrie',
        channel: {
          name: 'EssentialEDMusic'
        } as SearchVideo['channel']
      }),
      ytTrack({
        title: 'Savant - Orakel - Valkyrie',
        channel: {
          name: 'SAVANT'
        } as SearchVideo['channel']
      })
    ];

    const heuristics = new YoutubeHeuristics();
    const orderedTracks = heuristics.orderTracks({
      tracks,
      artist: 'Savant',
      title: 'Valkyrie'
    });

    expect(orderedTracks).toEqual([
      tracks[1],
      tracks[0]
    ]);
  });

  it('ranks videos whose names match the track title exactly, and channel names match artist name exactly higher', () => {
    const tracks = [
      ytTrack({
        title: 'Savant - Wildstyle',
        channel: {
          name: 'Tasty'
        } as SearchVideo['channel']
      }),
      ytTrack({
        title: 'Firestarter',
        channel: {
          name: 'SAVANT'
        } as SearchVideo['channel']
      })
    ];

    const heuristics = new YoutubeHeuristics();
    const orderedTracks = heuristics.orderTracks({
      tracks,
      artist: 'Savant',
      title: 'Firestarter'
    });

    expect(orderedTracks).toEqual([
      tracks[1],
      tracks[0]
    ]);
  });
});
