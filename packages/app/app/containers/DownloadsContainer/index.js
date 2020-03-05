import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as DownloadActions from '../../actions/downloads';
import * as SettingsActions from '../../actions/settings';
import Downloads from '../../components/Downloads';

class DownloadsContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.downloadActions.readDownloads();
  }

  render() {
    const {
      downloadActions,
      settingsActions,
      settings,
      downloads
    } = this.props;

    return (
      <Downloads
        downloads={downloads}
        downloadsDir={_.get(settings, 'downloads.dir')}
        clearFinishedTracks={downloadActions.clearFinishedDownloads}
        setStringOption={settingsActions.setStringOption}
      />
    );
  }
}

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
    downloads: state.downloads,
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
