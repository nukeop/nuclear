import React from 'react';

import styles from './styles.scss';

class PlaylistView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
  	let {
  		playlist
  	} = this.props;

    return (
      <div className={styles.playlist_view_container}>
        <div className={styles.playlist}>
          <div className={styles.playlist_info}>
            <div>
              <img 
                className={styles.playlist_thumbnail} 
                src={playlist.tracks[0].thumbnail} 
              />
            </div>
            <div className={styles.playlist_name}>
              {playlist.name}
            </div>
            

          </div>
          
          {
            playlist.tracks.map(track => {
              return (
                <div>
                  <img src={track.thumbnail} />
                  {track.artist} - {track.name}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default PlaylistView;
