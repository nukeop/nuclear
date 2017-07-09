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
        <Dimmer.Dimmable>
          <Dimmer active={this.props.album.loading}>
            <Loader/>
          </Dimmer>

          {
            this.props.album.loading
            ? null
            : <div className={styles.album_info_box}>
              <img src={this.props.album.images[0].uri}/>
              <div className={styles.album_details}>
                <div className={styles.album_title}>{this.props.album.title}</div>
                <div className={styles.album_artist}>by {this.props.album.artists[0].name}</div>
                <div className={styles.album_genre}>Genre: {this.props.album.styles[0]}</div>

                <div className = {styles.album_year}>Year: {this.props.album.year}</div>
                <div>Tracks: {this.props.album.tracklist.length}</div>
              </div>
            </div>
          }

        </Dimmer.Dimmable>
      </div>
    );
  }
}

export default AlbumView;
