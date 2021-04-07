import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';

import ArtistView from '../../components/ArtistView';
import * as SearchActions from '../../actions/search';
import { useArtistViewProps } from './hooks';

const ArtistViewContainer: React.FC = () => {
  const props = useArtistViewProps();
  const { artistId } = useParams<{ artistId: string }>();
  const dispatch = useDispatch();
  const artistReleasesSearch = useCallback(async (artistId) => {
    dispatch(SearchActions.artistReleasesSearch(artistId));
  }, [dispatch]);

  useEffect(() => {
    if (artistId !== 'loading') {
      artistReleasesSearch(artistId);
    }
  }, [artistId, artistReleasesSearch]);

  return <ArtistView
    {...props}
  />;
};

export default ArtistViewContainer;
