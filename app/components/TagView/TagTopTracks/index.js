import React from 'react';
import FontAwesome from 'react-fontawesome';

import { formatDuration } from '../../../utils';
import styles from './styles.scss';

class TagTopTracks extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      tracks
    } = this.props;
    console.log(tracks);
    return (
      <div className={styles.tag_top_tracks}>
        <table>
          <thead>
            <tr>
              <th><FontAwesome name='photo'/></th>
	      <th>Artist</th>
	      <th>Title</th>
	      <th>Duration</th>
	    </tr>
	  </thead>
          <tbody>
            
	    {
	      tracks.map((track, i) => {
		return (
		  <tr
		     key={i}
		     className={styles.track}
		     >
                    <td
		       style={{backgroundImage: `url(${track.image[1]['#text']})`}}
		       className={styles.track_thumbnail}
		       />
		    <td className={styles.track_artist}>{track.name}</td>
                    <td className={styles.track_name}>{track.artist.name}</td>
		    <td className={styles.track_duration}>{formatDuration(track.duration)}</td>
		  </tr>
		);
	      })
	    }
      
      </tbody>
	</table>
	</div>
    );
  }
}

export default TagTopTracks;
