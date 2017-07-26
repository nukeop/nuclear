import React from 'react';
import {Dimmer, Image, Loader} from 'semantic-ui-react';


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

          {
            this.props.artist.loading
            ? null
            : <div className={styles.artist}>
            <div
              style={{
                backgroundImage: 'url(' + this.props.artist.images[0].resource_url + ')'
              }}
              className={styles.artist_header}
            >

            </div>
                {this.props.artist.name}
                {this.props.artist.profile}

              </div>
          }

        </Dimmer.Dimmable>
      </div>
    )
  }
}

export default ArtistView;
