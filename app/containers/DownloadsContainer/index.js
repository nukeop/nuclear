import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Downloads from '../../components/Downloads';

const DownloadsContainer = props => {
  console.log(props);
  return (
    <Downloads
      downloads={ props.downloads }
    />
  );
};

DownloadsContainer.propTypes = {
  downloads: PropTypes.array
};

DownloadsContainer.defaultProps = {
  downloads: []
};

function mapStateToProps (state) {
  return {
    downloads: state.downloads.downloads
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign(
        {}
      ),
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadsContainer);
