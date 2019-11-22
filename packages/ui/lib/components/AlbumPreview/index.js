import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { getThumbnail } from '../AlbumGrid';
import ContextPopup from '../ContextPopup';
import PopupButton from '../PopupButton';
import TrackRow from '../TrackRow';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import styles from './styles.scss';

const AlbumPreview = ({ album, trackButtons }) => {
  return (
    <div className={styles.album_preview} >
      <div
        className={styles.album_cover}
        style={{backgroundImage: `url(${_.defaultTo(getThumbnail(album), artPlaceholder)})`}}
      />
      <div className={styles.track_list}>
        <table>
          <tbody>
            {
              album.tracks.map(track => (
                <ContextPopup
                  trigger={
                    <TrackRow
                      key={track.position}
                      track={track}
                      mini
                      displayArtist
                      displayAlbum
                      displayTrackNumber
                      displayDuration
                    />
                  }
                >
                  { trackButtons.map(trackButton => <PopupButton {...trackButton}/>) }
                </ContextPopup>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

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
  }),
  trackButtons: PropTypes.arrayOf(PropTypes.shape({
    onClick: PropTypes.func,
    ariaLabel: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string
  }))
};

export default AlbumPreview;
