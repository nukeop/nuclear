import React from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  Icon,
  Menu
} from 'semantic-ui-react';

import styles from './styles.scss';

const QueueMenuMore = props => {
  const {
    clearQueue,
    savePlaylistDialog
  } = props;
  
  return (
    <Dropdown
      item
      icon='ellipsis vertical'
      className={ styles.queue_menu_more }>
      <Dropdown.Menu>
        <Dropdown.Header>
          Queue
        </Dropdown.Header>
        <Dropdown.Item onClick={ clearQueue }>
          <Icon name='trash'/>
          Clear queue
        </Dropdown.Item>
        { savePlaylistDialog }
        <Dropdown.Divider />
        
        <Dropdown.Header>
          Current track
        </Dropdown.Header>
        <Dropdown.Item>
          <Icon name='plus'/>
          Add to playlist
        </Dropdown.Item>
        <Dropdown.Item>
          <Icon name='star'/>
          Add to favorites
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

QueueMenuMore.propTypes = {
  clearQueue: PropTypes.func,
  savePlaylistDialog: PropTypes.node
};

QueueMenuMore.defaultProps = {
  clearQueue: () => {},
  savePlaylistDialog: null
};

export default QueueMenuMore;
