import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Dropdown,
  Icon
} from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';

import InputDialog from '../../InputDialog';
import QueueMenuMore from './QueueMenuMore';

import styles from './styles.scss';
import settingsConst from '../../../constants/settings';

@withTranslation('queue')
class QueueMenu extends React.Component {
  constructor(props){
    super(props);
  }

  handleAddPlaylist(addPlaylist, notify, items, settings) {
    return name => {
      addPlaylist(items, name);
      notify(
        this.props.t('playlist-toast-title'),
        this.props.t('playlist-toast-content', { name }),
        null,
        settings
      );
    };
  }

  render() {
    let {
      addPlaylist,
      updatePlaylist,
      clearQueue,
      addFavoriteTrack,
      addToDownloads,
      success,
      items,
      toggleOption,
      settings,
      playlists,
      compact,
      t
    } = this.props;

    const firstTitle = _.get(_.head(items), 'name');
    return (
      <div className={styles.queue_menu_container}>
        <div className={styles.queue_menu_buttons}>
          <a href='#' className='compactButton' onClick={() => toggleOption(_.find(settingsConst, ['name', 'compactQueueBar']), settings)}>
            <Icon name={settings.compactQueueBar ? 'angle left' : 'angle right'} />
          </a>

          {
            !compact &&
              <QueueMenuMore
                  clearQueue={clearQueue}
                  updatePlaylist={updatePlaylist}
                  addFavoriteTrack={addFavoriteTrack}
                  addToDownloads={addToDownloads}
                  playlists={playlists}
                  currentItem={_.head(items)}
                  savePlaylistDialog={
                      <InputDialog
                          header={<h4>Input playlist name:</h4>}
                          placeholder={t('dialog-placeholder')}
                          accept={t('dialog-accept')}
                          onAccept={this.handleAddPlaylist(addPlaylist, success, items, settings)}
                          trigger={
                              <Dropdown.Item>
                                  <Icon name='save'/>
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
  }
}

QueueMenu.propTypes = {
  clearQueue: PropTypes.func,
  addPlaylist: PropTypes.func,
  updatePlaylist: PropTypes.func,
  toggleOption: PropTypes.func,
  addFavoriteTrack: PropTypes.func,
  success: PropTypes.func,
  settings: PropTypes.object,
  playlists: PropTypes.array,
  items: PropTypes.array,
  compact: PropTypes.bool
};

export default QueueMenu;
