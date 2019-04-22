import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Dropdown,
  Icon
} from 'semantic-ui-react';

import InputDialog from '../../InputDialog';
import QueueMenuMore from './QueueMenuMore';

import styles from './styles.scss';
import globalStyles from '../../../app.global.scss';
import settingsConst from '../../../constants/settings';

class QueueMenu extends React.Component {
  constructor(props){
    super(props);
  }

  handleAddPlaylist(addPlaylist, notify, items, settings) {
    return name => {
      addPlaylist(items, name);
      notify(
        'Playlist created',
        `Playlist ${name} has been created.`,
        null,
        settings
      );
    };
  }

  render() {
    let {
      addPlaylist,
      clearQueue,
      addFavoriteTrack,
      success,
      items,
      toggleOption,
      settings,
      playlists
    } = this.props;

    const firstTitle = _.get(_.head(items), 'name');
    
    return (
      <div className={styles.queue_menu_container}>
        <div className={styles.queue_menu_buttons}>
          <a href='#' className='compactButton' onClick={() => toggleOption(_.find(settingsConst, ['name', 'compactQueueBar']), settings)}>
            <Icon name={settings.compactQueueBar ? 'angle left' : 'angle right'} />
          </a>

          <QueueMenuMore
            clearQueue={ clearQueue }
            playlists={ playlists }
            addFavoriteTrack={ addFavoriteTrack }
            savePlaylistDialog={
              <InputDialog
                header={<h4>Input playlist name:</h4>}
                placeholder='Playlist name...'
                accept='Save'
                onAccept={this.handleAddPlaylist(addPlaylist, success, items, settings)}
                trigger={
                  <Dropdown.Item>
                    <Icon name='save'/>
                    Save as playlist
                  </Dropdown.Item>
                }
                initialString={ firstTitle }
              />
            }
          />
          
        </div>
        <hr />
      </div>
    );
  }
}

QueueMenu.propTypes = {
  clearQueue: PropTypes.func,
  addPlaylist: PropTypes.func,
  toggleOption: PropTypes.func,
  addFavoriteTrack: PropTypes.func,
  success: PropTypes.func,
  settings: PropTypes.object,
  playlists: PropTypes.array,
  items: PropTypes.array
};

export default QueueMenu;
