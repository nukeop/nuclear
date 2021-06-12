import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'semantic-ui-react';

import { getThumbnail } from '../..';
import ContextPopup from '../ContextPopup';
import TrackRow from '../TrackRow';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import styles from './styles.scss';

const AlbumPreview = ({
  album,
  trackButtons,

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
            onClick={handleAddToQueue}
          />
          <Button
            basic
            icon='play'
            size='huge'
            onClick={handlePlayAll}
          />
        </div>
      </div>
      <div
        className={styles.track_list}
      >
        <table>
          <tbody>
            {
              album.tracks.map((track, index) => (
                <ContextPopup
                  trigger={
                    <TrackRow
                      key={index}
                      track={track}
                      mini
                      displayArtist
                      displayAlbum
                      displayTrackNumber
                      displayDuration
                    />
                  }
                  key={index}
                  thumb={thumb}
                  title={track.name}
                  artist={_.get(album, 'artist.name')}
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

export default AlbumPreview;
