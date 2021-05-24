import React from 'react';
import cx from 'classnames';
import { CellProps } from 'react-table';
import { Icon } from 'semantic-ui-react';

import { Track } from '../../../types';
import styles from '../styles.scss';

const FavoriteCell: React.FC<CellProps<Track>> = ({
  cell,
  value
}) => <td {...cell.getCellProps()} className={cx(styles.favorite_cell, styles.narrow)}>
  <Icon name={value ? 'heart' : 'heart outline'} />
</td>;

export default FavoriteCell;
