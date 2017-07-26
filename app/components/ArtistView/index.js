import React from 'react';
import {Dimmer, Image, Loader} from 'semantic-ui-react';
import Spacer from '../Spacer';

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

                <Spacer/>

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
          }

        </Dimmer.Dimmable>
      </div>
    )
  }
}

export default ArtistView;
