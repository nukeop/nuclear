import React from 'react';
import PropTypes from 'prop-types';

import TrackRow from '../TrackRow';
import styles from './styles.scss';

const AlbumPreview = ({album}) => (
  <div className={styles.album_preview} >
    <div
      className={styles.album_cover}
      style={{backgroundImage: `url(${album.image[0]['#text']})`}}
    />
    <div className={styles.track_list}>
      <table>
        <tbody>
          {
            album.tracks.map(track => (
              <TrackRow
                key={track.position}
                track={track}
                mini
                displayArtist
                displayAlbum
                displayTrackNumber
                displayDuration
              />
            ))
          }
        </tbody>
      </table>
    </div>
  </div>
);

AlbumPreview.propTypes = {
  album: PropTypes.shape({
    artist: PropTypes.shape({
      name: PropTypes.string
    }),
    title: PropTypes.string.isRequired,
    tracks: PropTypes.arrayOf(PropTypes.shape({
      album: PropTypes.string,
      artist: PropTypes.shape({
        name: PropTypes.string
      }),
      duration: PropTypes.number,
      position: PropTypes.number,
      playcount: PropTypes.number
    })),
    image: PropTypes.arrayOf(PropTypes.shape({
      '#text': PropTypes.string
    }))
  })
};

export default AlbumPreview;
