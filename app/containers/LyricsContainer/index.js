import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LyricsView from '../../components/LyricsView';
import * as LyricsActions from '../../actions/lyrics';

class LyricsContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <LyricsView track={_.get(this.props.queue.queueItems, this.props.queue.currentSong, null)} lyrics={this.props.lyrics} />
    );
  }
}

function mapStateToProps (state) {
  return {
    queue: state.queue,
    lyrics: state.lyrics
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(LyricsActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LyricsContainer);
