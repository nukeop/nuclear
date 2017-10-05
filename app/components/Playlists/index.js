import React from 'react';

import Playlist from './Playlist';

import styles from './styles.scss';

class Playlists extends React.Component {
  render() {
  	let {
  		playlists
  	} = this.props;

    return (
      <div className={styles.playlists_container}>
        {
        	playlists.map((playlist, i) => {
        		return (
        			<Playlist
        				playlist={playlist}
        			/>
        		);
        	})
        }
      </div>
    );
  }
}

export default Playlists;
