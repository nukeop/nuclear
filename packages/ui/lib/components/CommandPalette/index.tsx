import React, { LegacyRef, useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import { head, isEmpty, take } from 'lodash';
import { Input, SemanticICONS, Transition } from 'semantic-ui-react';
import useOutsideClick from 'react-cool-onclickoutside';

import { CommandPaletteFooter } from './CommandPaletteFooter';
import { CommandPaletteAction } from './CommandPaletteAction';
import { CommandPaletteEmptyState } from './CommandPaletteEmptyState';
import styles from './styles.scss';
import common from '../../common.scss';

export type CommandPaletteAction = {
    id: string;
    name: string;
    shortcut?: string[];
    icon?: SemanticICONS;
    category?: string;
    onUse?: () => void;
}

export type CommandPaletteProps = React.ComponentProps<typeof CommandPaletteFooter> & 
React.ComponentProps<typeof CommandPaletteEmptyState> & {
    searchPlaceholder?: string;
    actions?: CommandPaletteAction[];
    isLoading?: boolean;
    inputValue?: string;
    onInputChange?: (text: string) => void;

    isOpen?: boolean;
    onClose?: () => void;

    inputRef?: LegacyRef<Input>;
};

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isLoading,
  searchPlaceholder = 'What would you like to do?',
  actions=[],
  inputValue,
  onInputChange,
  emptyStateText,
  isOpen,
  onClose,
  inputRef,
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

  const closeRef = useOutsideClick(onClose);

  useEffect(() => {
    if (isOpen) {
      setSelected(head(actions));
    }
  }, [inputValue]);

  return <Transition
    visible={isOpen}
    animation='fade'
    duration={200}
  >
    <div className={styles.transition_container}>
      <div
        data-testid='command-palette'
        className={cx(
          styles.command_palette_container,
          common.nuclear
        )}
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
              setSelected(null);
              onClose();
            } else if (e.key === 'Escape') {
              setSelected(null);
              onClose();
            }
          }}
          ref={closeRef}
        >
          <Input 
            className={styles.input}
            ref={inputRef}
            autoFocus
            iconPosition='left'
            icon={isLoading ? 'circle notch loading' : 'search'}
            size='big'
            placeholder={searchPlaceholder}
            value={inputValue}
            onChange={e => {
              onInputChange(e.target.value);
            }}
          />
          <div 
            className={styles.actions}
          >
            {
              !isLoading &&
                isEmpty(actions)
                ? <CommandPaletteEmptyState emptyStateText={emptyStateText}/>
                : take(actions, 5).map(action => (
                  <CommandPaletteAction 
                    key={action.id} 
                    onSelect={() => setSelected(action)}
                    isSelected={selected === action}
                    onClose={() => {
                      setSelected(null);
                      onClose();
                    }}
                    {...action} 
                  /> 
                ))
            }
          </div>
          <CommandPaletteFooter 
            {...footerProps}
          />
        </div>
      </div>
    </div>
  </Transition>;
};

export default CommandPalette;

