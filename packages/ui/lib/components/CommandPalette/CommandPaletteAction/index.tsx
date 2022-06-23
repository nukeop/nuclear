import React from 'react';
import { Icon } from 'semantic-ui-react';
import cx from 'classnames';

import { CommandPaletteAction as CommandPaletteActionType } from '..';

import common from '../../../common.scss';
import styles from './styles.scss';

type CommandPaletteActionProps = CommandPaletteActionType & {
    onSelect: () => void;
    isSelected?: boolean;
    onClose: () => void;
};

export const CommandPaletteAction: React.FC<CommandPaletteActionProps> = ({
  icon,
  name,
  shortcut,
  onUse,
  onSelect,
  onClose,
  isSelected
}) => {
  return <button 
    className={cx(
      common.nuclear, 
      styles.command_palette_action,
      { [styles.selected]: isSelected }
    )}
    onMouseOver={onSelect}
    onClick={() => {
      if (isSelected){
        onUse();
        onClose();
      } 
    }}
  >
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
  </button>;
};
