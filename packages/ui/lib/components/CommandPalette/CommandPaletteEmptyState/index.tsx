import React from 'react';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';

import common from '../../../common.scss';
import styles from './styles.scss';

export const CommandPaletteEmptyState: React.FC = () => {
  return <div className={cx(
    common.nuclear,
    styles.command_palette_empty_state
  )}>
    <Icon name='searchengin' size='massive' />
    <p>
      Can't seem to find what you're looking for?
    </p>
    <hr />
  </div>;
};
