import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as DownloadActions from '../../actions/downloads';
import Downloads from '../../components/Downloads';

const DownloadsContainer = props => {
  return (
    <Downloads
      downloads={ props.downloads }
      clearFinishedTracks={ props.downloadActions.clearFinishedDownloads }
    />
  );
};

DownloadsContainer.propTypes = {
  downloads: PropTypes.array,
  downloadActions: PropTypes.shape({
    clearFinishedDownloads: PropTypes.func
  })
};

DownloadsContainer.defaultProps = {
  downloads: [],
  downloadActions: {}
};

function mapStateToProps (state) {
  return {
    downloads: state.downloads.downloads
  };
}

function mapDispatchToProps (dispatch) {
  return {
    downloadActions: bindActionCreators(DownloadActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadsContainer);
