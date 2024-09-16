import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { find, isEmpty } from 'lodash';

import * as QueueActions from '../../actions/queue';
import { artistInfoSearchByName, albumInfoSearch, artistReleasesSearch } from '../../actions/search';
import * as FavoritesActions from '../../actions/favorites';
import { searchSelectors } from '../../selectors/search';
import { favoritesSelectors } from '../../selectors/favorites';
import { SearchResultsAlbum } from '@nuclear/core/src/plugins/plugins.types';

export const useArtistViewProps = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { artistId } = useParams<{ artistId: string }>();
  const artistDetails = useSelector(searchSelectors.artistDetails);
  const artist = artistDetails[artistId];
  const source = artist?.source;
  
  const addTrackToQueue = useCallback(async (item) => {
    dispatch(QueueActions.addToQueue(item));
  }, [dispatch]);

  const artistInfoSearchByNameCallback = useCallback(async (artistName: string) => {
    dispatch(artistInfoSearchByName(artistName, history));
  }, [history, dispatch]);

  const albumInfoSearchCallback = useCallback(async (albumId: string, releaseType: 'master' | 'release', release: SearchResultsAlbum) => {
    dispatch(albumInfoSearch(albumId, releaseType, release));
  }, [dispatch]);

  const favoriteArtists: { id: string }[] = useSelector(favoritesSelectors.artists);

  const getIsFavorite = (currentArtist, favoriteArtists) => {
    const favoriteArtist = find(favoriteArtists, {
      id: currentArtist?.id
    });
    return Boolean(favoriteArtist);
  };

  const isFavorite = getIsFavorite(artist, favoriteArtists);

  const addFavoriteArtist = useCallback(async () => {
    dispatch(FavoritesActions.addFavoriteArtist(artist));
  }, [artist, dispatch]);

  const removeFavoriteArtist = useCallback(async () => {
    dispatch(FavoritesActions.removeFavoriteArtist(artist));
  }, [artist, dispatch]);

  useEffect(() => {
    if (artistId !== 'loading' && isEmpty(artist.releases)) {
      dispatch(artistReleasesSearch(artistId, source));
    }
  }, [artistId, source]);

  return {
    artist,
    isFavorite,
    addTrackToQueue,
    artistInfoSearchByName: artistInfoSearchByNameCallback,
    albumInfoSearch: albumInfoSearchCallback,
    removeFavoriteArtist,
    addFavoriteArtist
  };
};
