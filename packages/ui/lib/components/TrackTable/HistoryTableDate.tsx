import React from 'react';
import * as styles from './styles.scss';

const HistoryTableDate: React.FC = ({children}) => {
  return <h2 className={styles.history_table_date}>{children}</h2>;
};

export default HistoryTableDate;
