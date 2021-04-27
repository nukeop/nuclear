import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Segment } from 'semantic-ui-react';

import PlaylistItem from './PlaylistItem';
import PlaylistsHeader from './PlaylistsHeader';
import { Playlist } from '@nuclear/core/src/helpers/playlist/types';
import styles from './styles.scss';

const EmptyState = () => {
  const { t } = useTranslation('playlists');
  return (
    <div className={styles.empty_state}>
      <Icon.Group>
        <Icon name='list alternate outline' />
      </Icon.Group>
      <h2>{t('empty')}</h2>
      <div>{t('empty-help')}</div>
    </div>
  );
};

type PlaylistsProps = {
  playlists: Playlist[];
  handleImportFromFile: React.MouseEventHandler;
}

const Playlists: React.FC<PlaylistsProps> = ({ playlists, handleImportFromFile }) => {
  
  function isPlaylistsReallyEmpty() {
    return (
      !playlists || Object.keys(playlists).length === 0 || playlists.length === 0
    );
  }

  function isPlaylistsReallyNotEmpty() {
    return playlists && playlists.length > 0;
  }

  return (
    <div className={styles.playlists_container}>
      <PlaylistsHeader 
        showText={isPlaylistsReallyNotEmpty()}
        handleImportFromFile={handleImportFromFile}
      />
      {
        isPlaylistsReallyEmpty() && 
        <EmptyState />
      }
      
      {
        isPlaylistsReallyNotEmpty() &&  
          <Segment className={styles.playlists_segment}>
            {playlists.map((playlist, i) => {
              return (
                <PlaylistItem
                  playlist={playlist}
                  index={i}
                  key={i}
                />
              );
            })}
          </Segment>    
      }
      
    </div>
  );
};

export default Playlists;
