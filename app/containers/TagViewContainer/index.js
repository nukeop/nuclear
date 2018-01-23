import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TagActions from '../../actions/tag';

import TagView from '../../components/TagView';

class TagViewContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      actions,
      match,
      tags
    } = this.props;
    return (
      <TagView
	 loadTagInfo={actions.loadTagInfo}
	 tag={match.params.tagName}
	 tags={tags}
	 />
    );
  }
}

function mapStateToProps(state) {
  return {
    tags: state.tags
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, TagActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TagViewContainer);
