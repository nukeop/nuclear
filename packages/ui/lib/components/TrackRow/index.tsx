import React from 'react';
import numeral from 'numeral';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';
import _ from 'lodash';

import artPlaceholder from '../../../resources/media/art_placeholder.png';
// eslint-disable-next-line node/no-missing-import
import { formatDuration } from '../../utils';
import { Track } from '../../types';
import styles from './styles.scss';

export const getTrackThumbnail = track => {
  return track.thumbnail ?? track.image?.[0]?.['#text'] ?? track.thumb;
};

export type TrackRowProps = {
  track: Partial<Track>;

  mini?: boolean;

  displayAlbum?: boolean;
  displayArtist?: boolean;
  displayCover?: boolean;
  displayDuration?: boolean;
  displayPlayCount?: boolean;
  displayTrackNumber?: boolean;

  withAddToDownloads?: boolean;
  withAddToFavorites?: boolean;
  withAddToQueue?: boolean;
  withDeleteButton?: boolean;
  withPlayNow?: boolean;

  onDelete?: React.MouseEventHandler;
}

const TrackRow: React.FC<TrackRowProps> = ({
  track,
  mini,
  displayAlbum,
  displayArtist,
  displayCover,
  displayDuration,
  displayPlayCount,
  displayTrackNumber,
  withDeleteButton,
  // don't comment these, despite no usage, otherwise `...other` includes them (causing React warning)
  withAddToDownloads, // eslint-disable-line
  withAddToFavorites, // eslint-disable-line
  onDelete,
  ...other
}) => (
  <tr
    className={cx(
      styles.track_row,
      {[styles.mini]: mini}
    )}
    {...other}
  >
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
        <img src={getTrackThumbnail(track) || artPlaceholder}/>
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
      <td>
        { 
          _.isString(track.artist) 
            ? track.artist
            : track.artist.name 
        }
      </td>
    }
    <td>
      { track.title ?? track.name }
    </td>
    {
      displayAlbum &&
      <td>
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
      <td>
        { numeral(track.playcount).format('0,0') }
      </td>
    }
  </tr>
);

export default TrackRow;
