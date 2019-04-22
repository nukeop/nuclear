import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Icon,
  Menu
} from 'semantic-ui-react';

import InputDialog from '../../InputDialog';

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
      success,
      items,
      toggleOption,
      settings
    } = this.props;

    const firstTitle = _.get(_.head(items), 'name');
    
    return (
      <div className={styles.queue_menu_container}>
        <div className={styles.queue_menu_buttons}>
          <a href='#' className='compactButton' onClick={() => toggleOption(_.find(settingsConst, ['name', 'compactQueueBar']), settings)}>
            <Icon name={settings.compactQueueBar ? 'angle left' : 'angle right'} />
          </a>
          <a href='#' onClick={clearQueue}><Icon name='trash alternate outline' /></a>

          <InputDialog
            header={<h4>Input playlist name:</h4>}
            placeholder='Playlist name...'
            accept='Save'
            onAccept={this.handleAddPlaylist(addPlaylist, success, items, settings)}
            trigger={
              <a href='#'><Icon name='save' /></a>
            }
            initialString={ firstTitle }
          />
          <a className={globalStyles.disabled} href='#'><Icon name='random' /></a>
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
  success: PropTypes.func,
  settings: PropTypes.object,
  items: PropTypes.array
};

export default QueueMenu;
