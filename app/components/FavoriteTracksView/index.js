import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Segment } from 'semantic-ui-react';

import Header from '../Header';
import TrackRow from '../TrackRow';

import styles from './styles.scss';

const FavoriteTracksView = props => {
  const {
    actions,
    dashboardData,
    history,
    musicSources,
    settings
  } = props;

  const {
    artistInfoSearchByName,
    albumInfoSearchByName,
    addToQueue,
    selectSong,
    clearQueue,
    startPlayback
  } = actions;
  
  return (
    <div className={styles.favorite_tracks_view}>
      <Header>
        Your favorite tracks
      </Header>
      <Segment>
        <table>
          <thead>
            <tr>
              <th><FontAwesome name='image' /></th>
              <th>Artist</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {
              props.tracks.map((track, i) => {
                return (
                  <TrackRow
                    key={'favorite-track-' + i}
                    track={track}
                    index={i}
                    addToQueue={addToQueue}
                    selectSong={selectSong}
                    clearQueue={clearQueue}
                    startPlayback={startPlayback}
                    musicSources={musicSources}
                    settings={settings}
                    displayCover
                    displayArtist
                  />
                );
              })
            }
          </tbody>
        </table>
      </Segment>
    </div>
  );
};

FavoriteTracksView.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape({
    artist: PropTypes.shape({
      name: PropTypes.string
    }),
    name: PropTypes.string
  })),
  settings: PropTypes.object,
  actions: PropTypes.object,
  musicSources: PropTypes.array
};

FavoriteTracksView.defaultProps = {
  tracks: []
};

export default FavoriteTracksView;
