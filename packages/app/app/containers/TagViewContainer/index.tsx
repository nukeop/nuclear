import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SearchActions from '../../actions/search';
import * as TagActions from '../../actions/tag';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';
import { RootState } from '../../reducers';

import TagView from '../../components/TagView';

type OwnProps = RouteComponentProps<{ tagName: string }>;

type StateProps = {
  tags: RootState['tags'];
  streamProviders: RootState['plugin']['plugins']['streamProviders'];
}

type DispatchProps = {
  actions: {
    loadTagInfo: typeof TagActions.loadTagInfo;
    artistInfoSearchByName: typeof SearchActions.artistInfoSearchByName;
    albumInfoSearchByName: typeof SearchActions.albumInfoSearchByName;
    addToQueue: typeof QueueActions.addToQueue;
  };
}

type Props = OwnProps & StateProps & DispatchProps;

const TagViewContainer: React.FC<Props> = ({ actions, history, match, tags, streamProviders }) => (
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

function mapStateToProps(state: RootState): StateProps {
  return {
    tags: state.tags,
    streamProviders: state.plugin.plugins.streamProviders
  };
}

function mapDispatchToProps(dispatch: any): DispatchProps {
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
