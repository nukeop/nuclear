import React from 'react';
import { useTranslation } from 'react-i18next';
import { DropResult } from 'react-beautiful-dnd';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Dimmer, Icon, Loader } from 'semantic-ui-react';

import { Playlist } from '@nuclear/core';
import { Playlists as PlaylistsTable } from '@nuclear/ui';

import PlaylistsHeader from './PlaylistsHeader';
import { reorderPlaylists } from '../../actions/playlists';
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
  isLoading: boolean;
  playlists: Playlist[];
  onImportFromFile: React.MouseEventHandler;
  onCreate: (name: string) => void;
}

const Playlists: React.FC<PlaylistsProps> = ({
  isLoading = false,
  playlists,
  onImportFromFile,
  onCreate
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t, i18n } = useTranslation('playlists');

  function isPlaylistsReallyEmpty() {
    return (
      !playlists || Object.keys(playlists).length === 0 || playlists.length === 0
    );
  }

  function isPlaylistsReallyNotEmpty() {
    return playlists && playlists.length > 0;
  }

  const strings = {
    tracksSingular: t('tracks-singular'),
    tracksPlural: t('tracks-plural'),
    modifiedAt: t('modified-at'),
    neverModified: t('never-modified'),
    serverModifiedAt: t('server-modified-at'),
    uploadToServer: t('upload-to-server'),
    downloadFromServer: t('download-from-server'),
    locale: i18n.language
  };

  const callbacks = {
    onPlaylistDownload: () => { },
    onPlaylistUpload: () => { },
    onPlaylistClick: (id: string) => history.push(`/playlist/${id}`),
    onDragEnd: ({ source, destination }: DropResult) => dispatch(reorderPlaylists(source.index, destination.index))
  };

  return (
    <div className={styles.playlists_container}>
      {
        isLoading
          ? <Dimmer active={isLoading}>
            <Loader data-testid='loader' />
          </Dimmer>
          : <>
            <PlaylistsHeader
              onImportFromFile={onImportFromFile}
              onCreate={onCreate}
            />
            {
              isPlaylistsReallyEmpty() &&
              <EmptyState />
            }

            {
              isPlaylistsReallyNotEmpty() &&
              <PlaylistsTable
                playlists={playlists}

                {...strings}
                {...callbacks}
              />
            }
          </>
      }

    </div>
  );
};

export default Playlists;
