export function mockPodcastResult() {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: jest.fn(() => ({
        'resultCount': 1,
        'results': [
          {
            'wrapperType': 'track',
            'kind': 'podcast',
            'collectionId': 427166321,
            'trackId': 427166321,
            'artistName': 'Patrick Wheeler and Jason Gauci',
            'collectionName': 'Programming Throwdown',
            'trackName': 'Programming Throwdown',
            'collectionCensoredName': 'Programming Throwdown',
            'trackCensoredName': 'Programming Throwdown',
            'collectionViewUrl': 'https://podcasts.apple.com/us/podcast/programming-throwdown/id427166321?uo=4',
            'feedUrl': 'https://feeds.transistor.fm/programming-throwdown',
            'trackViewUrl': 'https://podcasts.apple.com/us/podcast/programming-throwdown/id427166321?uo=4',
            'artworkUrl30': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/30x30bb.jpg',
            'artworkUrl60': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/60x60bb.jpg',
            'artworkUrl100': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/100x100bb.jpg',
            'collectionPrice': 0.00,
            'trackPrice': 0.00,
            'trackRentalPrice': 0,
            'collectionHdPrice': 0,
            'trackHdPrice': 0,
            'trackHdRentalPrice': 0,
            'releaseDate': '2021-07-07T17:08:00Z',
            'collectionExplicitness': 'cleaned',
            'trackExplicitness': 'cleaned',
            'trackCount': 115,
            'country': 'USA',
            'currency': 'USD',
            'primaryGenreName': 'How To',
            'contentAdvisoryRating': 'Clean',
            'artworkUrl600': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/600x600bb.jpg',
            'genreIds': [
              '1499',
              '26',
              '1304',
              '1489',
              '1528'
            ],
            'genres': [
              'How To',
              'Podcasts',
              'Education',
              'News',
              'Tech News'
            ]
          }
        ]
      }))
    })
  ) as any;
}

export function mockPodcastEpisodesResult() {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: jest.fn(() => ({
        'resultCount': 2,
        'results': [
          {
            'wrapperType': 'track',
            'kind': 'podcast',
            'collectionId': 427166321,
            'trackId': 427166321,
            'artistName': 'Patrick Wheeler and Jason Gauci',
            'collectionName': 'Programming Throwdown',
            'trackName': 'Programming Throwdown',
            'collectionCensoredName': 'Programming Throwdown',
            'trackCensoredName': 'Programming Throwdown',
            'collectionViewUrl': 'https://podcasts.apple.com/us/podcast/programming-throwdown/id427166321?uo=4',
            'feedUrl': 'https://feeds.transistor.fm/programming-throwdown',
            'trackViewUrl': 'https://podcasts.apple.com/us/podcast/programming-throwdown/id427166321?uo=4',
            'artworkUrl30': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/30x30bb.jpg',
            'artworkUrl60': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/60x60bb.jpg',
            'artworkUrl100': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/100x100bb.jpg',
            'collectionPrice': 0.00,
            'trackPrice': 0.00,
            'trackRentalPrice': 0,
            'collectionHdPrice': 0,
            'trackHdPrice': 0,
            'trackHdRentalPrice': 0,
            'releaseDate': '2021-07-07T17:08:00Z',
            'collectionExplicitness': 'cleaned',
            'trackExplicitness': 'cleaned',
            'trackCount': 115,
            'country': 'USA',
            'currency': 'USD',
            'primaryGenreName': 'How To',
            'contentAdvisoryRating': 'Clean',
            'artworkUrl600': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/600x600bb.jpg',
            'genreIds': [
              '1499',
              '26',
              '1304',
              '1489',
              '1528'
            ],
            'genres': [
              'How To',
              'Podcasts',
              'Education',
              'News',
              'Tech News'
            ]
          },
          {
            'collectionViewUrl': 'https://itunes.apple.com/us/podcast/programming-throwdown/id427166321?mt=2&uo=4',
            'trackTimeMillis': 4554000,
            'episodeUrl': 'https://pdst.fm/e/media.transistor.fm/283dafdd/f6b075ca.mp3',
            'artworkUrl600': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/600x600bb.jpg',
            'previewUrl': 'https://pdst.fm/e/media.transistor.fm/283dafdd/f6b075ca.mp3',
            'artworkUrl160': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/160x160bb.jpg',
            'episodeContentType': 'audio',
            'artworkUrl60': 'https://is3-ssl.mzstatic.com/image/thumb/Podcasts125/v4/83/e8/a9/83e8a9d5-df87-b19d-7050-55e4ce4df89d/mza_13511678666604160959.jpg/60x60bb.jpg',
            'contentAdvisoryRating': 'Clean',
            'trackViewUrl': 'https://podcasts.apple.com/us/podcast/route-planning-with-parker-woodward/id427166321?i=1000528145455&uo=4',
            'episodeFileExtension': 'mp3',
            'artistIds': [],
            'closedCaptioning': 'none',
            'trackId': 1000528145455,
            'trackName': 'Route Planning with Parker Woodward',
            'shortDescription': 'Ever wondered how route planning apps, well, plan routes? In this episode, we navigate through this fascinating topic, a field as data-driven and systemic as it is magical and compelling. \n\nJoining us is Parker Woodward, Route Expert and Marketing Direc',
            'feedUrl': 'https://feeds.transistor.fm/programming-throwdown',
            'collectionId': 427166321,
            'collectionName': 'Programming Throwdown',
            'country': 'USA',
            'description': 'Ever wondered how route planning apps, well, plan routes? In this episode, we navigate through this fascinating topic, a field as data-driven and systemic as it is magical and compelling. \n\nJoining us is Parker Woodward, Route Expert and Marketing Director for Route4Me. We discuss how route planning works, the intricacies behind it, and how services like Route4Me perform complex balancing acts between machine learning and user-generated feedback.',
            'genres': [
              {
                'name': 'How To',
                'id': '1499'
              }
            ],
            'episodeGuid': '0b5e5727-6569-4185-b08f-5414b76005ff',
            'releaseDate': '2021-07-07T17:08:21Z',
            'kind': 'podcast-episode',
            'wrapperType': 'podcastEpisode'
          }
        ]
      }))
    })
  ) as any;
}
