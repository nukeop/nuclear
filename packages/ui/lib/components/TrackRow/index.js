import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';

import artPlaceholder from '../../../resources/media/art_placeholder.png';
import { formatDuration } from '../../utils';
import styles from './styles.scss';

const getTrackThumbnail = track => {
  return _.get(
    track,
    'thumbnail',
    _.get(track, 'image[0][#text]', artPlaceholder)
  );
};

const TrackRow = ({
  track,
  mini,
  displayAlbum,
  displayArtist,
  displayCover,
  displayDuration,
  displayPlayCount,
  displayTrackNumber,
  withDeleteButton,
  onDelete
}) => (
  <tr className={cx(
    styles.track_row,
    {[styles.mini]: mini}
  )}>
    {
      withDeleteButton &&
      <td className={styles.track_row_buttons}>
        <a onClick={onDelete}>
          <Icon name='close' />
        </a>
      </td>
    }
    {
      displayCover &&
      <td className={styles.track_row_thumbnail}>
        <img src={getTrackThumbnail(track)}/>
      </td>
    }
    {
      displayTrackNumber &&
      <td className={styles.track_row_position}>
        { track.position }
      </td>
    }
    {
      displayArtist &&
      <td className={styles.track_row_artist}>
        { track.artist.name }
      </td>
    }
    <td className={styles.track_row_name}>
      { track.name }
    </td>
    {
      displayAlbum &&
      <td className={styles.track_row_album}>
        { track.album }
      </td>
    }
    {
      displayDuration &&
      <td className={styles.track_row_duration}>
        { formatDuration(track.duration) }
      </td>
    }
    {
      displayPlayCount &&
      <td className={styles.track_row_playcount}>
        { numeral(track.playcount).format('0,0') }
      </td>
    }
  </tr>
);

TrackRow.propTypes = {
  track: PropTypes.shape({
    local: PropTypes.bool,
    album: PropTypes.string,
    artist: PropTypes.shape({
      name: PropTypes.string
    }),
    duration: PropTypes.number,
    position: PropTypes.number,
    playcount: PropTypes.number
  }),

  mini: PropTypes.bool,

  displayAlbum: PropTypes.bool,
  displayArtist: PropTypes.bool,
  displayCover: PropTypes.bool,
  displayDuration: PropTypes.bool,
  displayPlayCount: PropTypes.bool,
  displayTrackNumber: PropTypes.bool,

  withAddToDownloads: PropTypes.bool,
  withAddToFavorites: PropTypes.bool,
  withAddToQueue: PropTypes.bool,
  withDeleteButton: PropTypes.bool,
  withPlayNow: PropTypes.bool,

  onDelete: PropTypes.func
};

export default TrackRow;
