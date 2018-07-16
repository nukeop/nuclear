import React from 'react';
import {Tab} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const ChartsTab = props => {
  return (
    <Tab.Pane attached={false}>
      <div className={styles.charts_container}>
        <h3>Charts in Nuclear are coming soon.</h3>
      </div>
    </Tab.Pane>
  );
};

ChartsTab.propTypes = {

};

export default ChartsTab;
