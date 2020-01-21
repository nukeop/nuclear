import React from 'react';
import PropTypes from 'prop-types';
import { shell } from 'electron';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';

import styles from './styles.scss';

const handleClick = settings => {
  const apiUrl = `http://localhost:${settings['api.port']}/nuclear/docs` ;
  shell.openExternal(apiUrl);
};

const HttpApiUrl = ({ settings }) => {
  return (
    <a
      className={styles.http_api_url}
      onClick={() => handleClick(settings)}>
      <Icon name='linkify'/>
      API Docs
    </a>
  );
};

HttpApiUrl.propTypes = {
  settings: PropTypes.object
};

HttpApiUrl.defaultProps = {
  settings: {}
};

function mapStateToProps(state) {
  return {
    settings: state.settings
  };
}

export default connect(mapStateToProps, null)(HttpApiUrl);
