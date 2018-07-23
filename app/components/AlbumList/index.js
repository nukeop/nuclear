import React from 'react';
import {Dimmer, Image, Loader} from 'semantic-ui-react';
import Card from '../Card';

import styles from './styles.scss';

class AlbumList extends React.Component {
  constructor(props) {
    super(props);
  }

  albumInfoSearch(albumId) {
    this.props.albumInfoSearch(albumId);
    this.props.history.push('/album/' + albumId);
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
                    image={el.thumb}
                    onClick={() => this.albumInfoSearch(el.id)}
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
