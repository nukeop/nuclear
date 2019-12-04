import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  withHandlers,
  withState,
  compose
} from 'recompose';
import { Button } from 'semantic-ui-react';

import { getThumbnail } from '../../utils';
import ContextPopup from '../ContextPopup';
import TrackRow from '../TrackRow';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import styles from './styles.scss';

const AlbumPreview = ({
  album,
  trackButtons,
  target,
  handleListClick,

  handleAddToQueue,
  handlePlayAll
}) => {
  const thumb = _.defaultTo(getThumbnail(album), artPlaceholder);
  const TrackButtons = trackButtons;

  return (
    <div className={styles.album_preview} >
      <div
        className={styles.album_cover}
        style={{ backgroundImage: `url(${thumb})` }}
      >
        <div className={styles.album_cover_overlay}>
          <Button
            basic
            icon='plus'
            size='huge'
            onClick={ handleAddToQueue }
          />
          <Button
            basic
            icon='play'
            size='huge'
            onClick={ handlePlayAll }
          />
        </div>
      </div>
      <div
        className={styles.track_list}
        onClick={handleListClick}
      >
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
                  thumb={thumb}
                  title={track.name}
                  artist={_.get(album, 'artist.name')}
                  target={target}
                >
                  <TrackButtons
                    track={track}
                    withAddToDownloads={false}
                  />
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
      name: PropTypes.string,
      duration: PropTypes.number,
      position: PropTypes.number,
      playcount: PropTypes.number
    })),
    image: PropTypes.arrayOf(PropTypes.shape({
      '#text': PropTypes.string
    }))
  }),
  trackButtons: PropTypes.object
};

export default compose(
  withState(
    'target', 'setTarget', { x: 0, y: 0 }
  ),
  withHandlers({
    handleListClick: ({ setTarget }) => e => setTarget({ x: e.clientX, y: e.clientY })
  })
)(AlbumPreview);
