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
        (!playlists || Object.keys(playlists).length === 0 || playlists.length === 0) &&
            <h3>No playlists.</h3>
        }
        {
        	playlists && playlists.length > 0 && playlists.map((playlist, i) => {
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
