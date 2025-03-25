import { Video } from '@distube/ytsr';
import { YoutubeHeuristics } from './heuristics';

export const ytTrack = (overrides?: Partial<Video>): Partial<Video> => ({
  name: 'Black Sabbath - Paranoid',
  author: {
    name: 'Black Sabbath'
  } as Video['author'],
  duration: '172',
  ...overrides
});

describe('Search heuristics', () => {
  it('finds a verbatim match', () => {
    const tracks = [
      ytTrack({
        name: 'Ozzy Osbourne - Crazy Train'
      }),
      ytTrack({
        name: 'Frank Zappa - Muffin Man'
      }),
      ytTrack({
        name: 'Black Sabbath - Paranoid'
      }),
      ytTrack({
        name: 'The White Stripes - Seven Nation Army'
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
        name: 'Rammstein - Zick Zack (Official Video)'
      }),
      ytTrack({
        name: 'Rammstein - Zeit (Official Video)'
      }),
      ytTrack({
        name: 'Rammstein - Zeig Dich (Official Lyric Video)'
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
        name: 'Johnny Cash - The Mercy Seat'
      }),
      ytTrack({
        name: 'Nick Cave - The Mercy Seat'
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
        name: 'The Whte Stipes - Sevn Natn Ary'
      }),
      ytTrack({
        name: 'The Whte Stripes - Sevn Nation Army'
      }),
      ytTrack({
        name: 'Arctic Monkeys - Do I Wanna Know'
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
        name: 'Ozzy Osbourne - Crazy Train (crappy bootleg)'
      }),
      ytTrack({
        name: 'Ozzy Osbourne - Crazy Train - Official Video'
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
        name: 'Ozzy Osbourne - Crazy Train (crappy bootleg)'
      }),
      ytTrack({
        name: 'Ozzy Osbourne - Crazy Train (HQ)'
      }),
      ytTrack({
        name: 'Ozzy Osbourne - Crazy Train - High Quality'
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
        name: 'Frank Zappa - Peaches en Regalia',
        duration: '180'
      }),
      ytTrack({
        name: 'Frank Zappa - Peaches en Regalia',
        duration: '219'
      }),
      ytTrack({
        name: 'Frank Zappa - Peaches en Regalia',
        duration: '300'
      }),
      ytTrack({
        name: 'Frank Zappa - Peaches en Regalia',
        duration: '360'
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
        name: 'Black Sabbath - Paranoid (Full album)'
      }),
      ytTrack({
        name: 'Black Sabbath - Paranoid (random addition to the title)'
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
        name: 'Black Sabbath - Paranoid (Live)'
      }),
      ytTrack({
        name: 'Black Sabbath - Paranoid (Something else)'
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
        name: 'Black Sabbath - Paranoid'
      }),
      ytTrack({
        name: 'Black Sabbath - Paranoid (Live)'
      }),
      ytTrack({
        name: 'Black Sabbath - Paranoid (Random addition to the title)'
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
        name: 'Black Sabbath - Paranoid (Remix)'
      }),
      ytTrack({
        name: 'Black Sabbath - Paranoid (Random addition to the title)'
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
        name: 'Savant - Valkyrie',
        author: {
          name: 'EssentialEDMusic'
        } as Video['author']
      }),
      ytTrack({
        name: 'Savant - Orakel - Valkyrie',
        author: {
          name: 'SAVANT'
        } as Video['author']
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
        name: 'Savant - Wildstyle',
        author: {
          name: 'Tasty'
        } as Video['author']
      }),
      ytTrack({
        name: 'Firestarter',
        author: {
          name: 'SAVANT'
        } as Video['author']
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
