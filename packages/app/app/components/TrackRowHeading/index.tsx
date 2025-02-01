import React from 'react';

import styles from './styles.scss';

type TrackRowHeadingPops = {
  title: string;
}

const TrackRowHeading = ({title}: TrackRowHeadingPops) => {
  return !title ? null : (
    <tr className={styles.heading_container}>
      <td colSpan={3}>
        {title}
      </td>
    </tr>
  );
};

export default TrackRowHeading;
