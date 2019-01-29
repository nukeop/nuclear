import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import * as TagActions from '../../actions/tag';
import * as QueueActions from '../../actions/queue';

import TagView from '../../components/TagView';

class TagViewContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    let {
      actions,
      match,
      history,
      tags,
      musicSources
    } = this.props;

    return (
      <TagView
        loadTagInfo={actions.loadTagInfo}
        addToQueue={actions.addToQueue}
        artistInfoSearchByName={actions.artistInfoSearchByName}
        history={history}
        tag={match.params.tagName}
        tags={tags}
        musicSources={musicSources}
        clearQueue={actions.clearQueue}
        selectSong={actions.selectSong}
        startPlayback={actions.startPlayback}
      />
    );
  }
}

function mapStateToProps (state) {
  return {
    tags: state.tags,
    musicSources: state.plugin.plugins.musicSources
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, Actions, TagActions, QueueActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TagViewContainer));
