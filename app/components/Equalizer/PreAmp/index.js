import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const PreAmp = ({
  onChange,
  value
}) => (
  <React.Fragment>
    <span>10 dB</span>
    <input
      type='range'
      onChange={evt => onChange(Number(evt.target.value))}
      value={value}
      className={styles.preamp}
      min={-10}
      max={10}
      step={1}
    />
    <span>-10 dB</span>
  </React.Fragment>
);

PreAmp.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired
};

export default PreAmp;

