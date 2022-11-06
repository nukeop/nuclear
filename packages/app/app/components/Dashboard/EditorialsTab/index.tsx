import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tab } from 'semantic-ui-react';

import { CardsRow } from '@nuclear/ui';
import { DeezerEditorialCharts } from '@nuclear/core/src/rest/Deezer';

import styles from './styles.scss';
import { PromotedArtistsContainer } from '../../../containers/PromotedArtistsContainer';

type EditorialsTabProps = { 
  isLoading: boolean;
    playlists?: DeezerEditorialCharts['playlists']['data'];
    artists?: DeezerEditorialCharts['artists']['data'];
    albums?: DeezerEditorialCharts['albums']['data'];
    isPromotedArtistsEnabled: boolean;

    artistInfoSearchByName: (artistName: string) => void;
    albumInfoSearchByName: (albumName: string, artistName: string) => void;
    onEditorialPlaylistClick: (playlistId: number) => void;
}

const EditorialsTab: React.FC<EditorialsTabProps> = ({
  isLoading,
  playlists,
  artists, 
  albums,
  isPromotedArtistsEnabled,
  artistInfoSearchByName,
  albumInfoSearchByName,
  onEditorialPlaylistClick
}) => {
  const { t } = useTranslation('dashboard');

  return <Tab.Pane
    loading={isLoading}
    attached={false}
    className={styles.editorials_tab}>
    {
      !isLoading && 
      <>
        <div className={styles.row}>
          <CardsRow
            cards={
              playlists?.map(playlist => ({
                id: playlist.id.toString(),
                header: playlist.title,
                image: playlist.picture_medium,
                onClick: () => onEditorialPlaylistClick(playlist.id)
              }))
            }
            header={t('trending-playlists')}
            filterPlaceholder={t('filter')}
            nothingFoundLabel={t('nothing-found')}
          />
        </div>
        {
          isPromotedArtistsEnabled &&
          <PromotedArtistsContainer />
        }
        <div className={styles.row}>
          <CardsRow 
            cards={
              artists?.map(artist => ({
                id: artist.id.toString(),
                header: artist.name,
                image: artist.picture_medium,
                onClick: () => artistInfoSearchByName(artist.name)
              }))
            }
            header={t('trending-artists')}
            filterPlaceholder={t('filter')}
            nothingFoundLabel={t('nothing-found')}
          />
        </div>
        <div className={styles.row}>
          <CardsRow 
            cards={
              albums?.map(album => ({
                id: album.id.toString(),
                header: album.title,
                image: album.cover_medium,
                onClick: () => albumInfoSearchByName(album.title, album.artist.name)
              }))
            }
            header={t('trending-albums')}
            filterPlaceholder={t('filter')}
            nothingFoundLabel={t('nothing-found')}
          />
        </div>
      </>
    }
  </Tab.Pane>;
};

export default EditorialsTab;
