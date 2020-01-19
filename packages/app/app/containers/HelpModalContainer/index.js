import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import HelpModal from '../../components/HelpModal';
import { githubContribInfo } from '../../actions/githubContrib';

const HelpModalContainer = props => <HelpModal {...props} />;

function mapStateToProps(state) {
  return {
    githubContrib: state.githubContrib
  };
}


export default compose(
  withRouter,
  connect(mapStateToProps, { githubContribInfo })
)(HelpModalContainer);
