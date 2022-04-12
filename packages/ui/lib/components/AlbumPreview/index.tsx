import React from 'react';
import _ from 'lodash';
import { Button } from 'semantic-ui-react';

import { getThumbnail } from '../..';
import { Album } from '../../types';
import ContextPopup from '../ContextPopup';
import TrackRow from '../TrackRow';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import styles from './styles.scss';


type AlbumPreviewProps = {
  album?: Album;
  trackButtons?: React.ElementType ;
};

type Handlers = {
  handleAddToQueue: () => void;
  handlePlayAll: () => void;
};

const AlbumPreview: React.FC<AlbumPreviewProps & Handlers> = (props) => {

  const { album, trackButtons, handleAddToQueue, handlePlayAll } = props;

  const thumb = _.defaultTo(getThumbnail(album), artPlaceholder);
  const TrackButtons = trackButtons;

  return (
    <div className={styles.album_preview}>
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

export default AlbumPreview;
