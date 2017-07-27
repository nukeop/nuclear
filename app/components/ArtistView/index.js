import React from 'react';
import {Dimmer, Loader} from 'semantic-ui-react';
import Spacer from '../Spacer';
import AlbumList from '../AlbumList';

import styles from './styles.scss';

class ArtistView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.artist_view_container}>
        <Dimmer.Dimmable>
          <Dimmer active={this.props.artist.loading}>
            <Loader/>
          </Dimmer>

            {this.props.artist.loading
              ? null
              : <div className={styles.artist}>
                <div style={{
                  background: `url('${this.props.artist.images[0].resource_url}')`,
                  backgroundRepeat: 'noRepeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }} className={styles.artist_header}>

                  <div className={styles.artist_header_overlay}>
                    <div className={styles.artist_header_container}>
                      <div className={styles.artist_avatar} style={{
                        background: `url('${this.props.artist.images[1].resource_url}')`,
                        backgroundRepeat: 'noRepeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                      }}></div>
                      <h1>{this.props.artist.name}</h1>
                    </div>
                  </div>

                </div>
              </div>
          }

          <hr />
          <AlbumList
            albums={this.props.artist.releases}
            albumInfoSearch={this.props.albumInfoSearch}
            history={this.props.history}
          />
        </Dimmer.Dimmable>
      </div>
    )
  }
}
export default ArtistView;
