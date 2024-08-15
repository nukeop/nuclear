import DiscogsMetaProvider from './discogs';

describe('DiscogsMetaProvider', () => {
  const provider = new DiscogsMetaProvider();

  describe('Verify if an artist is on tour', () => {

    test('Should return false if the artist info is missing', () => {
      expect(provider.isArtistOnTour(undefined)).toBeFalsy();
    });

    test('Should return false if the \'ontour\' flag is not \'1\'', () => {
      const artistInfo: any = {
        ontour: 'something else than 1'
      };
      expect(provider.isArtistOnTour(artistInfo)).toBeFalsy();
    });

    test('Should return false if the \'ontour\' flag is \'1\'', () => {
      const artistInfo: any = {
        ontour: '1'
      };
      expect(provider.isArtistOnTour(artistInfo)).toBeTruthy();
    });
  });
});
