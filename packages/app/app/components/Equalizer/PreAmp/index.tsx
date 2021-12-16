import React from 'react';
import styles from './index.scss';

type PreAmpProps = {
  value: number;
  onChange: (n: number) => void;
}


const PreAmp: React.FC<PreAmpProps> = ({
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


export default PreAmp;

