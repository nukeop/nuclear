import React from 'react';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';

import common from '../../../common.module.scss';
import styles from './styles.module.scss';

type CommandPaletteEmptyStateProps = {
  emptyStateText: string;
}

export const CommandPaletteEmptyState: React.FC<CommandPaletteEmptyStateProps> = ({ emptyStateText }) => {
  return <div className={cx(
    common.nuclear,
    styles.command_palette_empty_state
  )}>
    <Icon name='searchengin' size='massive' />
    <p>
      {emptyStateText}
    </p>
    <hr />
  </div>;
};
