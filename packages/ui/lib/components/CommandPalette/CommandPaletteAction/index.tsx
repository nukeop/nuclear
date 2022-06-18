import React from 'react';
import { Icon } from 'semantic-ui-react';
import { CommandPaletteAction as CommandPaletteActionProps } from '..';

import styles from './styles.scss';

export const CommandPaletteAction: React.FC<CommandPaletteActionProps> = ({
  icon,
  name,
  shortcut
}) => {
  return <div className={styles.command_palette_action} >
    <div className={styles.action_left}>
      {icon && <Icon name={icon} />}
      <div className={styles.action_name}>
        {name}
      </div>
    </div>
    <div className={styles.action_right}>
      {
        shortcut && shortcut.length > 0 && 
        <kbd className={styles.shortcut}>{shortcut}</kbd>
      }
    </div>
  </div>;
};
