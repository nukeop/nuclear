import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as QueueActions from '../../actions/queue';


import PlayQueue from '../../components/PlayQueue';


class PlayQueueContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <PlayQueue
        items={this.props.queue.queueItems}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    queue: state.queue
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(QueueActions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlayQueueContainer));
