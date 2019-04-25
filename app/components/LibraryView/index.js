import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

// import styles from './index.scss';

const LibraryView = ({ byArtist, actions, musicSources, pending }) => {
  return (
    <div>
      <h1>Local library</h1>
      <div>
        <Icon
          name='refresh'
          loading={pending}
          onClick={actions.scanLocalFolders}  
        />
      </div>
      {pending && <span>Loading ...</span>}
      {!pending && byArtist && Object.keys(byArtist).map((artist, idx) => (
        <div key={idx}>
          <h2>{artist}</h2>
          <div>
            {Array.isArray(byArtist[artist]) && byArtist[artist].map((track, idx) => (
              <div style={{ cursor: 'pointer' }} key={idx} onClick={() => actions.addToQueue(musicSources, {
                artist: track.artist,
                name: track.name,
                thumbnail: track.thumbnail
              })}>
                {track.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

LibraryView.propTypes = {
  pending: PropTypes.bool,
  byArtist: PropTypes.object,
  actions: PropTypes.object,
  musicSources: PropTypes.array
};

export default LibraryView;
