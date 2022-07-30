import React, { useEffect, useState } from 'react';
import { sample } from 'lodash';
import {  useSelector } from 'react-redux';
import { Loader } from 'semantic-ui-react';

import { PromotedArtist } from '@nuclear/ui';
import { ConfigFlag, ParamKey } from '@nuclear/core/src/rest/Nuclear/Configuration';
import { PromotedArtist as PromotedArtistType } from '@nuclear/core/src/rest/Nuclear/Promotion';

import { isConfigFlagEnabled, nuclearSelectors, paramValue } from '../../selectors/nuclear';
import { dashboardSelector } from '../../selectors/dashboard';
import styles from './styles.scss';
import { shell } from 'electron';

export const PromotedArtistsContainer: React.FC = () => {
  const isPromotedArtistFeatureEnabled = useSelector(isConfigFlagEnabled(ConfigFlag.PROMOTED_ARTISTS));
  const promotedArtistBackground = useSelector(paramValue(ParamKey.PROMOTED_ARTIST_BACKGROUND));
  const [promotedArtist, setPromotedArtist] = useState<PromotedArtistType | null>(null);

  const dashboard = useSelector(dashboardSelector);
  const nuclearConfig = useSelector(nuclearSelectors.configuration);

  useEffect(() => {
    setPromotedArtist(sample(dashboard.promotedArtists.data));
  }, []);
  
  const isLoading = nuclearConfig.configuration.isLoading || nuclearConfig.params.isLoading || dashboard.promotedArtists.isLoading;

  return isPromotedArtistFeatureEnabled && promotedArtist && ( 
    isLoading 
      ? <Loader /> 
      : <div className={styles.promoted_artist_row}>
        <PromotedArtist
          name={promotedArtist.name}
          description={promotedArtist.description}
          imageUrl={promotedArtist.picture}
          backgroundImageUrl={promotedArtistBackground}
          onListenClick={() => {}}
          onExternalUrlClick={() => shell.openExternal(promotedArtist.link)}
        />
      </div>
  );
};
