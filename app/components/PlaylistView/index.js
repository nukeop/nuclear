import React from 'react';
import FontAwesome from 'react-fontawesome';

import Spacer from '../Spacer';

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
            <div className={styles.playlist_header}>
	      <div className={styles.playlist_name}>
		{playlist.name}
	      </div>
	      <Spacer />
              <div className={styles.playlist_buttons}>
                <a href="#" className={styles.play_button}><FontAwesome name="play" /> Play</a>
		<a href="#" className={styles.more_button}><FontAwesome name="ellipsis-h" /></a>
	      </div>
	    </div>
	    

	  </div>

	  <div className={styles.playlist_tracks}>
	    
	    {
	      playlist.tracks.map(track => {
		return (
		  <div className={styles.playlist_track}>
		    <img className={styles.track_thumbnail} src={track.thumbnail} />
		    <div className={styles.track_info}>
		      <div className={styles.track_artist}>{track.artist}</div>
		      <div className={styles.track_name}>{track.name}</div>
		    </div>
		  </div>
		);
	      })
	  }
      
      </div>
	</div>
	</div>
    );
  }
}

export default PlaylistView;
