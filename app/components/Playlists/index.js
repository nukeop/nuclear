import React from 'react';

import Playlist from './Playlist';

import styles from './styles.scss';

class Playlists extends React.Component {
  render() {
  	let {
      history,
  		playlists
  	} = this.props;

    return (
      <div className={styles.playlists_container}>
        {
        	playlists.map((playlist, i) => {
        		return (
        			<Playlist
        				playlist={playlist}
                history={history}
                index={i}
        			/>
        		);
        	})
        }
      </div>
    );
  }
}

export default Playlists;
