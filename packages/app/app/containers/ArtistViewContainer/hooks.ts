import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import * as QueueActions from '../../actions/queue';
import * as SearchActions from '../../actions/search';
import { searchSelectors } from '../../selectors/search';

export const useArtistViewProps = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { artistId } = useParams<{ artistId: string }>();
  const artistDetails = useSelector(searchSelectors.artistDetails);
  const artist = artistDetails[artistId];

  const addTrackToQueue = useCallback(async (item) => {
    dispatch(QueueActions.addToQueue(item));
  }, [dispatch]);

  const artistInfoSearchByName = useCallback(async (artistName) => {
    dispatch(SearchActions.artistInfoSearchByName(artistName, history));
  }, [history, dispatch]);

  const albumInfoSearch = useCallback(async (albumId, releaseType, release) => {
    dispatch(SearchActions.albumInfoSearch(albumId, releaseType, release));
  }, [dispatch]);

  return {
    artist,
    addTrackToQueue,
    artistInfoSearchByName,
    albumInfoSearch
  };
};
