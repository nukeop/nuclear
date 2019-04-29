import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Segment } from 'semantic-ui-react';

import Header from '../Header';
import TrackRow from '../TrackRow';

import styles from './index.scss';

const LibraryView = ({ tracks, actions, pending }) => {
  return (
    <div className={styles.local_files_view}>
      <Header>
        Local Library
        <Icon
          name='refresh'
          loading={pending}
          onClick={actions.scanLocalFolders}
          className={styles.refresh_icon}
        />
      </Header>
      {!pending && (
        <Segment>
          <table>
            <thead>
              <tr>
                <th><Icon name='image' /></th>
                <th>Artist</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {tracks && tracks.map((track, idx) => (
                <TrackRow
                  key={'favorite-track-' + idx}
                  track={track}
                  index={idx}
                  displayCover
                  displayArtist
                  withAddToDownloads={false}
                  isLocal
                />
              ))}
            </tbody>
          </table>
        </Segment>
      )}
    </div>
  );
};

LibraryView.propTypes = {
  pending: PropTypes.bool,
  tracks: PropTypes.array,
  // byArtist: PropTypes.object,
  actions: PropTypes.object
};

export default LibraryView;
