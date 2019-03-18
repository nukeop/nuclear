import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const Equalizer = ({ values, onChange }) => (
  <div className={styles.equalizer_wrapper}>
    <h1>Equalizer</h1>
    <div className={styles.equalizer}>
      {values.map((value, idx) => (
        <div key={idx} className={styles.slider_container}>
          <input
            type='range'
            min='-10'
            max='10'
            className={styles.slider}
            value={value}
            onChange={evt => {
              const updatedValues = [...values];

              updatedValues[idx] = Number(evt.target.value);
              onChange(updatedValues);
            }}
          />
        </div>
      ))}
    </div>
  </div>
);

Equalizer.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func
};

export default Equalizer;
