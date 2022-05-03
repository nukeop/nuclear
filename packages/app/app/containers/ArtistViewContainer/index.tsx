import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';

import ArtistView from '../../components/ArtistView';
import { artistReleasesSearch } from '../../actions/search';
import { useArtistViewProps } from './hooks';
import { SearchResultsSource } from '@nuclear/core/src/plugins/plugins.types';

const ArtistViewContainer: React.FC = () => {
  const props = useArtistViewProps();
  const { artistId } = useParams<{ artistId: string }>();
  const source = props.artist?.source;
  const dispatch = useDispatch();
  const artistReleasesSearchCallback = useCallback(async (artistId: string, source: SearchResultsSource) => {
    dispatch(artistReleasesSearch(artistId, source));
  }, [dispatch]);

  useEffect(() => {
    if (artistId !== 'loading') {
      artistReleasesSearchCallback(artistId, source);
    }
  }, [artistId, source, artistReleasesSearchCallback]);

  return <ArtistView
    {...props}
  />;
};

export default ArtistViewContainer;
