import React, { useEffect, useState } from 'react';
import { shell } from 'electron';
import { sample } from 'lodash';
import {  useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Loader } from 'semantic-ui-react';

import { PromotedArtist } from '@nuclear/ui';
import { ConfigFlag, ParamKey } from '@nuclear/core/src/rest/Nuclear/Configuration';
import { PromotedArtist as PromotedArtistType } from '@nuclear/core/src/rest/Nuclear/Promotion';

import { isConfigFlagEnabled, nuclearSelectors, paramValue } from '../../selectors/nuclear';
import { dashboardSelector } from '../../selectors/dashboard';
import styles from './styles.scss';
import { selectMetaProvider } from '../../actions/plugins';
import { unifiedSearch } from '../../actions/search';

const mapMetaProvider = (name: PromotedArtistType['metaProvider']) => ({
  bandcamp: 'Bandcamp Meta Provider',
  discogs: 'Discogs Metadata Provider',
  musicbrainz: 'Musicbrainz Meta Provider',
  soundcloud: 'Soundcloud Meta Provider'
})[name];

export const PromotedArtistsContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const isPromotedArtistFeatureEnabled = useSelector(isConfigFlagEnabled(ConfigFlag.PROMOTED_ARTISTS));
  const promotedArtistBackground = useSelector(paramValue(ParamKey.PROMOTED_ARTIST_BACKGROUND));
  const [promotedArtist, setPromotedArtist] = useState<PromotedArtistType | null>(null);

  const dashboard = useSelector(dashboardSelector);
  const nuclearConfig = useSelector(nuclearSelectors.configuration);

  useEffect(() => {
    setPromotedArtist(sample(dashboard.promotedArtists.data));
  }, []);
  
  const isLoading = nuclearConfig.configuration.isLoading || nuclearConfig.params.isLoading || dashboard.promotedArtists.isLoading;

  const onListenClick = () => {
    if (promotedArtist) {
      dispatch(selectMetaProvider(mapMetaProvider(promotedArtist.metaProvider)));
      dispatch(unifiedSearch(promotedArtist.name, history));
    }
  };

  if (!isPromotedArtistFeatureEnabled || !promotedArtist) {
    return null;
  }

  return ( 
    isLoading 
      ? <Loader />
      : <div className={styles.promoted_artist_row}>
        <PromotedArtist
          name={promotedArtist.name}
          description={promotedArtist.description}
          imageUrl={promotedArtist.picture}
          backgroundImageUrl={promotedArtistBackground}
          onListenClick={onListenClick}
          onExternalUrlClick={() => shell.openExternal(promotedArtist.link)}
        />
      </div>
  );
};
