import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LyricsView from '../../components/LyricsView';
import * as LyricsActions from '../../actions/lyrics';

const LyricsContainer = ({ queue, lyrics }) => (
  <LyricsView
    track={_.get(
      queue.queueItems,
      queue.currentSong,
      null
    )}
    lyrics={lyrics}
  />
);

function mapStateToProps(state) {
  return {
    queue: state.queue,
    lyrics: state.lyrics
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(LyricsActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LyricsContainer);
