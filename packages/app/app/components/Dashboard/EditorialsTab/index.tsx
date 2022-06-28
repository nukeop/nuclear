import React from 'react';
import { DeezerEditorialCharts } from '@nuclear/core/src/rest/Deezer';

import styles from './styles.scss';
import { CardsRow } from '@nuclear/ui';
import { useTranslation } from 'react-i18next';

type EditorialsTabProps = {
    playlists: DeezerEditorialCharts['playlists']['data'];
}

const EditorialsTab: React.FC<EditorialsTabProps> = ({playlists}) => {
  const { t } = useTranslation('dashboard');
  return <div className={styles.editorials_tab}>
    <div className={styles.playlists_row}>
      <CardsRow 
        cards={playlists.map(playlist => ({
          id: playlist.id.toString(),
          header: playlist.title,
          image: playlist.picture_medium
        })
        )}
        header={t('trending-playlists')}
        filterPlaceholder={t('filter-playlists')}
      />
    </div>
  </div>;
};

export default EditorialsTab;
