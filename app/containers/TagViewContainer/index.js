import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TagActions from '../../actions/tag';
import * as QueueActions from '../../actions/queue';

import TagView from '../../components/TagView';

class TagViewContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      actions,
      match,
      tags,
      musicSources
    } = this.props;
    return (
      <TagView
	 loadTagInfo={actions.loadTagInfo}
	 addToQueue={actions.addToQueue}
	 tag={match.params.tagName}
	 tags={tags}
	 musicSources={musicSources}
	 />
    );
  }
}

function mapStateToProps(state) {
  return {
    tags: state.tags,
    musicSources: state.plugin.plugins.musicSources
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, TagActions, QueueActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TagViewContainer);
