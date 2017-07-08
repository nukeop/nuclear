import React from 'react';
import {Dimmer, Loader, Image, Segment} from 'semantic-ui-react'

import styles from './styles.scss';

class AlbumView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.album_view_container}>

        <Dimmer active={this.props.album.loading}>
          <Loader  />

          {this.props.album.title}
          </Dimmer>
      </div>
    );
  }
}

export default AlbumView;
