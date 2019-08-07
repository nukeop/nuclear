import React from 'react';
import {Dimmer, Loader} from 'semantic-ui-react';
import _ from 'lodash';

import Card from '../Card';

import styles from './styles.scss';

class AlbumList extends React.Component {
  constructor(props) {
    super(props);
  }

  albumInfoSearch(albumId, releaseType) {
    this.props.albumInfoSearch(albumId, releaseType);
    this.props.history.push('/album/' + albumId);
  }

  getThumbnail(album) {
    return _.get(album, 'images[0].uri', _.get(album, 'thumb'));
  }

  render() {
    return (
      <div className={styles.album_list_container}>
        {
          this.props.albums && this.props.albums.length > 0
            ? <div className={styles.album_list_cards}>
              {
                this.props.albums.map((el, i) => {
                  return  (
                    <Card
                      key={i}
                      header={el.title}
                      image={this.getThumbnail(el)}
                      onClick={() => this.albumInfoSearch(el.id, el.type)}
                    />);
                })
              }
            </div>
            : <Dimmer.Dimmable>
              <Dimmer active>
                <Loader />
              </Dimmer>
            </Dimmer.Dimmable>
        }
      </div>
    );
  }
}

export default AlbumList;
