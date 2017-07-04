import React from 'react';
import {Dimmer, Loader, Image} from 'semantic-ui-react'

import styles from './styles.scss';

class AlbumView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.album_view_container}>
        <Dimmer active>
          <Loader/>
        </Dimmer>
        {this.props.album.name}
      </div>
    );
  }
}

export default AlbumView;
