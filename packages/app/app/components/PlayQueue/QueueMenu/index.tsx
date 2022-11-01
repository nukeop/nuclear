import React from 'react';
import { head, isEmpty } from 'lodash';
import {
  Dropdown,
  Icon
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Playlist, PlaylistTrack } from '@nuclear/core';
import { InputDialog } from '@nuclear/ui';
import QueueMenuMore from './QueueMenuMore';
import settingsConst from '../../../constants/settings';
import { PlayQueueActions } from '../../../containers/PlayQueueContainer';
import { QueueItem } from '../../../reducers/queue';
import { SettingsState } from '../../../reducers/settings';
import styles from './styles.scss';

type QueueMenuProps = {
  addPlaylist: PlayQueueActions['addPlaylist'];
  updatePlaylist: PlayQueueActions['updatePlaylist'];
  clearQueue: PlayQueueActions['clearQueue'];
  resetPlayer: PlayQueueActions['resetPlayer'];
  addFavoriteTrack: PlayQueueActions['addFavoriteTrack'];
  addToDownloads: (track: QueueItem) => void;
  currentSong: number;
  success : PlayQueueActions['success'];
  items: QueueItem[];
  toggleOption: PlayQueueActions['toggleOption'];
  settings: SettingsState;
  playlists: Playlist[];
  compact: boolean;
}

const QueueMenu: React.FC<QueueMenuProps> = ({
  addPlaylist,
  updatePlaylist,
  clearQueue,
  resetPlayer,
  addFavoriteTrack,
  addToDownloads,
  currentSong,
  success,
  items,
  toggleOption,
  settings,
  playlists,
  compact
}) => {
  const {t} = useTranslation('queue');
  const handleAddPlaylist = name => {
    addPlaylist(items as PlaylistTrack[], name);
    success(
      t('playlist-toast-title'),
      t('playlist-toast-content', { name }),
      null,
      settings
    );
  };

  const firstTitle = head(items)?.name;
  return (
    <div className={styles.queue_menu_container}>
      <div className={styles.queue_menu_buttons}>
        <a
          href='#'
          className='compactButton'
          data-testid='queue-menu-collapse'
          onClick={() => toggleOption(
            settingsConst.find(setting => setting.name === 'compactQueueBar'),
            settings
          )}
        >
          <Icon name={settings.compactQueueBar ? 'angle left' : 'angle right'} />
        </a>

        {
          !compact &&
            <QueueMenuMore
              disabled={isEmpty(items)}
              clearQueue={clearQueue}
              resetPlayer={resetPlayer}
              updatePlaylist={updatePlaylist}
              addFavoriteTrack={addFavoriteTrack}
              addToDownloads={addToDownloads}
              playlists={playlists}
              currentItem={items[currentSong]}
              savePlaylistDialog={
                <InputDialog
                  header={<h4>Input playlist name:</h4>}
                  placeholder={t('dialog-placeholder')}
                  acceptLabel={t('dialog-accept')}
                  cancelLabel={t('dialog-cancel')}
                  onAccept={handleAddPlaylist}
                  trigger={
                    <Dropdown.Item>
                      <Icon name='save' />
                      {t('dialog-trigger')}
                    </Dropdown.Item>
                  }
                  initialString={firstTitle}
                />
              }
            />
        }

      </div>
      <hr />
    </div>
  );
};

export default QueueMenu;
