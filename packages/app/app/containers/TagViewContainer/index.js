import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SearchActions from '../../actions/search';
import * as TagActions from '../../actions/tag';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';

import TagView from '../../components/TagView';

const TagViewContainer = ({ actions, history, match, tags, streamProviders }) => (
  <TagView
    loadTagInfo={actions.loadTagInfo}
    artistInfoSearchByName={actions.artistInfoSearchByName}
    albumInfoSearchByName={actions.albumInfoSearchByName}
    history={history}
    tag={match.params.tagName}
    tags={tags}
    streamProviders={streamProviders}
    addToQueue={actions.addToQueue}
  />
);

function mapStateToProps(state) {
  return {
    tags: state.tags,
    streamProviders: state.plugin.plugins.streamProviders
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign({}, SearchActions, TagActions, QueueActions, PlayerActions),
      dispatch
    )
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TagViewContainer)
);
