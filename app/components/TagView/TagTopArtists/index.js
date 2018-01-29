import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import styles from './styles.scss';

class TagTopArtists extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      topArtists
    } = this.props;
    return (
      <div className={styles.tag_top_artists}>
	<h4>Top Artists</h4>
        <div className={styles.top_artists}>
          <div className={styles.top_artist}>
            <div
	       className={styles.top_artist_photo}
	       style={{backgroundImage: `url(${_.last(topArtists[0].image)['#text']})`}}
	       />
            <div
	       className={styles.artist_overlay}
	       >
              <div className={styles.artist_name}>{topArtists[0].name}</div>
	    </div>
	  </div>

          <div className={styles.other_artists}>
	    {
	      topArtists.slice(1, 5).map((artist, i) => {
		return (
                  <div
		    key={i}
		    className={styles.other_artist}
		    >
                    <div
		      className={styles.other_artist_photo}
		      style={{backgroundImage: `url(${_.last(artist.image)['#text']})`}}
		      />
		    <div
		      className={styles.artist_overlay}
		      >
		      <div className={classnames(styles.artist_name, styles.other_artist_name)}>{artist.name}</div>
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

export default TagTopArtists;
