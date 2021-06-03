import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';

import ArtistView from '../../components/ArtistView';
import * as SearchActions from '../../actions/search';
import { useArtistViewProps } from './hooks';

const ArtistViewContainer: React.FC = () => {
  const props = useArtistViewProps();
  const { artistId } = useParams<{ artistId: string }>();
  const source = props.artist?.source;
  const dispatch = useDispatch();
  const artistReleasesSearch = useCallback(async (artistId, source) => {
    dispatch(SearchActions.artistReleasesSearch(artistId, source));
  }, [dispatch]);

  useEffect(() => {
    if (artistId !== 'loading') {
      artistReleasesSearch(artistId, source);
    }
  }, [artistId, source, artistReleasesSearch]);

  return <ArtistView
    {...props}
  />;
};

export default ArtistViewContainer;
