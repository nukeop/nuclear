import React, { useCallback, useState } from 'react';
import cx from 'classnames';
import { Input, SemanticICONS } from 'semantic-ui-react';
import { CommandPaletteFooter } from './CommandPaletteFooter';

import common from '../../common.scss';
import styles from './styles.scss';
import { CommandPaletteAction } from './CommandPaletteAction';
import { isEmpty, take } from 'lodash';
import { CommandPaletteEmptyState } from './CommandPaletteEmptyState';

export type CommandPaletteAction = {
    id: string;
    name: string;
    shortcut?: string[];
    icon?: SemanticICONS;
    category?: string;
    onUse?: () => void;
}

export type CommandPaletteProps = React.ComponentProps<typeof CommandPaletteFooter> & {
    searchPlaceholder?: string;
    actions?: CommandPaletteAction[];
    isLoading?: boolean;
    inputValue?: string;
    onInputChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isLoading,
  searchPlaceholder = 'What would you like to do?',
  actions=[],
  inputValue,
  onInputChange,
  ...footerProps
}) => {
  const [selected, setSelected] = useState<CommandPaletteAction | null>(null);
  const currentIndex = actions.findIndex(action => action.id === selected?.id);
  const displayedActionsLength = Math.min(actions.length, 5);

  const selectNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    setSelected(actions[nextIndex % displayedActionsLength]);
  }, [actions, currentIndex]);

  const selectPrevious = useCallback(() => {
    const previousIndex = currentIndex - 1 < 0 
      ? displayedActionsLength - 1 
      : currentIndex - 1;
    setSelected(actions[previousIndex]);
  }, [actions, currentIndex]);

  return <div
    className={cx(styles.command_palette_container, common.nuclear)}
  >
    <div 
      className={styles.command_palette}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown') {
          selectNext();
        } else if (e.key === 'ArrowUp') {
          selectPrevious();
        } else if (e.key === 'Enter' && selected) {
          selected.onUse();
        }
      }}
    >
      <Input 
        className={styles.input}
        autoFocus
        iconPosition='left'
        icon={isLoading ? 'circle notch loading' : 'search'}
        size='big'
        placeholder={searchPlaceholder}
        value={inputValue}
        onChange={onInputChange}
      />
      <div 
        className={styles.actions}
      >
        {
          !isLoading &&
            isEmpty(actions)
            ? <CommandPaletteEmptyState />
            : take(actions, 5).map(action => (
              <CommandPaletteAction 
                key={action.id} 
                onSelect={() => setSelected(action)}
                isSelected={selected === action}
                {...action} 
              /> 
            ))
        }
      </div>
      <CommandPaletteFooter 
        {...footerProps}
      />
    </div>
  </div>;
};

export default CommandPalette;
