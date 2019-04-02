import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as QueueActions from '../../actions/queue';

const LibraryViewContainer = ({ byArtist, actions, musicSources }) => (
  <div>
    <h1>Local library</h1>
    {byArtist && Object.keys(byArtist).map((artist, idx) => (
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

function mapStateToProps(state) {
  return {
    musicSources: state.plugin.plugins.musicSources.filter(({ sourceName }) => sourceName === 'Local'),
    byArtist: _.groupBy(Object.values(state.local.tracks), track => track.artist)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(QueueActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LibraryViewContainer);
