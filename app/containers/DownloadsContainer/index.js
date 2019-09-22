import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as DownloadActions from '../../actions/downloads';
import * as SettingsActions from '../../actions/settings';
import Downloads from '../../components/Downloads';

const DownloadsContainer = props => {
  return (
    <Downloads
      downloads={props.downloads}
      downloadsDir={props.settings['downloads.dir']}
      clearFinishedTracks={props.downloadActions.clearFinishedDownloads}
      setStringOption={props.settingsActions.setStringOption}
    />
  );
};

DownloadsContainer.propTypes = {
  downloads: PropTypes.array,
  downloadActions: PropTypes.shape({
    clearFinishedDownloads: PropTypes.func
  }),
  settingsActions: PropTypes.shape({
    setStringOption: PropTypes.func
  })
};

DownloadsContainer.defaultProps = {
  downloads: [],
  downloadActions: {}
};

function mapStateToProps (state) {
  return {
    downloads: state.downloads.downloads,
    settings: state.settings
  };
}

function mapDispatchToProps (dispatch) {
  return {
    downloadActions: bindActionCreators(DownloadActions, dispatch),
    settingsActions: bindActionCreators(SettingsActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadsContainer);
