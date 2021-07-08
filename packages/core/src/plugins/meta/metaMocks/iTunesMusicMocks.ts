export function mockArtistResult() {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: jest.fn(() => ({
        'resultCount': 1,
        'results': [
          {
            'wrapperType': 'artist',
            'artistType': 'Artist',
            'artistName': 'Queen',
            'artistLinkUrl': 'https://music.apple.com/us/artist/queen/3296287?uo=4',
            'artistId': 3296287,
            'amgArtistId': 5205,
            'primaryGenreName': 'Rock',
            'primaryGenreId': 21
          }
        ]
      }))
    })
  ) as any;
}

export function mockAlbumResult() {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: jest.fn(() => ({
        'resultCount': 1,
        'results': [
          {
            'wrapperType': 'collection',
            'collectionType': 'Album',
            'artistId': 3296287,
            'collectionId': 1440650428,
            'amgArtistId': 5205,
            'artistName': 'Queen',
            'collectionName': 'The Platinum Collection (Greatest Hits I, II & III)',
            'collectionCensoredName': 'The Platinum Collection (Greatest Hits I, II & III)',
            'artistViewUrl': 'https://music.apple.com/us/artist/queen/3296287?uo=4',
            'collectionViewUrl': 'https://music.apple.com/us/album/the-platinum-collection-greatest-hits-i-ii-iii/1440650428?uo=4',
            'artworkUrl60': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/60x60bb.jpg',
            'artworkUrl100': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/100x100bb.jpg',
            'collectionPrice': 24.99,
            'collectionExplicitness': 'notExplicit',
            'trackCount': 51,
            'copyright': '℗ 2014 Hollywood Records, Inc.',
            'country': 'USA',
            'currency': 'USD',
            'releaseDate': '2014-01-01T08:00:00Z',
            'primaryGenreName': 'Rock'
          }
        ]
      }))
    })
  ) as any;
}

export function mockTrackResult() {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: jest.fn(() => ({
        'resultCount': 1,
        'results': [
          {
            'wrapperType': 'track',
            'kind': 'song',
            'artistId': 3296287,
            'collectionId': 1440650428,
            'trackId': 1440651216,
            'artistName': 'Queen',
            'collectionName': 'The Platinum Collection (Greatest Hits I, II & III)',
            'trackName': 'We Will Rock You',
            'collectionCensoredName': 'The Platinum Collection (Greatest Hits I, II & III)',
            'trackCensoredName': 'We Will Rock You',
            'artistViewUrl': 'https://music.apple.com/us/artist/queen/3296287?uo=4',
            'collectionViewUrl': 'https://music.apple.com/us/album/we-will-rock-you/1440650428?i=1440651216&uo=4',
            'trackViewUrl': 'https://music.apple.com/us/album/we-will-rock-you/1440650428?i=1440651216&uo=4',
            'previewUrl': 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/14/f0/9a/14f09aae-20d5-641b-2fc4-6d8151f623d0/mzaf_5184580475352686527.plus.aac.p.m4a',
            'artworkUrl30': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/30x30bb.jpg',
            'artworkUrl60': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/60x60bb.jpg',
            'artworkUrl100': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/100x100bb.jpg',
            'collectionPrice': 24.99,
            'trackPrice': 0.69,
            'releaseDate': '1977-10-07T12:00:00Z',
            'collectionExplicitness': 'notExplicit',
            'trackExplicitness': 'notExplicit',
            'discCount': 3,
            'discNumber': 1,
            'trackCount': 17,
            'trackNumber': 16,
            'trackTimeMillis': 122123,
            'country': 'USA',
            'currency': 'USD',
            'primaryGenreName': 'Rock',
            'isStreamable': true
          }
        ]
      }))
    })
  ) as any;
}

export function mockArtistAlbumsResult() {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: jest.fn(() => ({
        'resultCount': 2,
        'results': [
          {
            'wrapperType': 'artist',
            'artistType': 'Artist',
            'artistName': 'Queen',
            'artistLinkUrl': 'https://music.apple.com/us/artist/queen/3296287?uo=4',
            'artistId': 3296287,
            'amgArtistId': 5205,
            'primaryGenreName': 'Rock',
            'primaryGenreId': 21
          },
          {
            'wrapperType': 'collection',
            'collectionType': 'Album',
            'artistId': 3296287,
            'collectionId': 1440650428,
            'amgArtistId': 5205,
            'artistName': 'Queen',
            'collectionName': 'The Platinum Collection (Greatest Hits I, II & III)',
            'collectionCensoredName': 'The Platinum Collection (Greatest Hits I, II & III)',
            'artistViewUrl': 'https://music.apple.com/us/artist/queen/3296287?uo=4',
            'collectionViewUrl': 'https://music.apple.com/us/album/the-platinum-collection-greatest-hits-i-ii-iii/1440650428?uo=4',
            'artworkUrl60': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/60x60bb.jpg',
            'artworkUrl100': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/100x100bb.jpg',
            'collectionPrice': 24.99,
            'collectionExplicitness': 'notExplicit',
            'trackCount': 51,
            'copyright': '℗ 2014 Hollywood Records, Inc.',
            'country': 'USA',
            'currency': 'USD',
            'releaseDate': '2014-01-01T08:00:00Z',
            'primaryGenreName': 'Rock'
          }
        ]
      }))
    })
  ) as any;
}

export function mockAlbumSongsSearch() {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: jest.fn(() => ({
        'resultCount': 2,
        'results': [
          {
            'wrapperType': 'collection',
            'collectionType': 'Album',
            'artistId': 3296287,
            'collectionId': 1440650428,
            'amgArtistId': 5205,
            'artistName': 'Queen',
            'collectionName': 'The Platinum Collection (Greatest Hits I, II & III)',
            'collectionCensoredName': 'The Platinum Collection (Greatest Hits I, II & III)',
            'artistViewUrl': 'https://music.apple.com/us/artist/queen/3296287?uo=4',
            'collectionViewUrl': 'https://music.apple.com/us/album/the-platinum-collection-greatest-hits-i-ii-iii/1440650428?uo=4',
            'artworkUrl60': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/60x60bb.jpg',
            'artworkUrl100': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/100x100bb.jpg',
            'collectionPrice': 24.99,
            'collectionExplicitness': 'notExplicit',
            'trackCount': 51,
            'copyright': '℗ 2014 Hollywood Records, Inc.',
            'country': 'USA',
            'currency': 'USD',
            'releaseDate': '2014-01-01T08:00:00Z',
            'primaryGenreName': 'Rock'
          },
          {
            'wrapperType': 'track',
            'kind': 'song',
            'artistId': 3296287,
            'collectionId': 1440650428,
            'trackId': 1440650711,
            'artistName': 'Queen',
            'collectionName': 'The Platinum Collection (Greatest Hits I, II & III)',
            'trackName': 'Bohemian Rhapsody',
            'collectionCensoredName': 'The Platinum Collection (Greatest Hits I, II & III)',
            'trackCensoredName': 'Bohemian Rhapsody',
            'artistViewUrl': 'https://music.apple.com/us/artist/queen/3296287?uo=4',
            'collectionViewUrl': 'https://music.apple.com/us/album/bohemian-rhapsody/1440650428?i=1440650711&uo=4',
            'trackViewUrl': 'https://music.apple.com/us/album/bohemian-rhapsody/1440650428?i=1440650711&uo=4',
            'previewUrl': 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/41/3d/83/413d8349-283e-d476-10ba-01bd0979ecda/mzaf_6563023006229503211.plus.aac.p.m4a',
            'artworkUrl30': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/30x30bb.jpg',
            'artworkUrl60': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/60x60bb.jpg',
            'artworkUrl100': 'https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/83/23/e4/8323e48b-3467-448b-1ce0-8981d8a97437/source/100x100bb.jpg',
            'collectionPrice': 24.99,
            'trackPrice': 0.69,
            'releaseDate': '1975-10-31T12:00:00Z',
            'collectionExplicitness': 'notExplicit',
            'trackExplicitness': 'notExplicit',
            'discCount': 3,
            'discNumber': 1,
            'trackCount': 17,
            'trackNumber': 1,
            'trackTimeMillis': 355145,
            'country': 'USA',
            'currency': 'USD',
            'primaryGenreName': 'Rock',
            'isStreamable': true
          }
        ]
      }))
    })
  ) as any;
}
