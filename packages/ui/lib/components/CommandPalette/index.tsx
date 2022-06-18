import React from 'react';
import cx from 'classnames';
import { Input, SemanticICONS } from 'semantic-ui-react';
import { CommandPaletteFooter } from './CommandPaletteFooter';

import common from '../../common.scss';
import styles from './styles.scss';
import { CommandPaletteAction } from './CommandPaletteAction';
import { take } from 'lodash';

export type CommandPaletteAction = {
    id: string;
    name: string;
    shortcut?: string[];
    icon?: SemanticICONS;
    category?: string;
}

export type CommandPaletteProps = React.ComponentProps<typeof CommandPaletteFooter> & {
    searchPlaceholder?: string;
    actions?: CommandPaletteAction[];
    isLoading?: boolean;
};

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isLoading,
  searchPlaceholder = 'What would you like to do?',
  actions=[],
  ...footerProps
}) => {
  return <div className={cx(styles.command_palette_container, common.nuclear)}>
    <div className={styles.command_palette}>
      <Input 
        className={styles.input}
        iconPosition='left'
        icon={isLoading ? 'circle notch loading' : 'search'}
        size='big'
        placeholder={searchPlaceholder}
      />
      <div className={styles.actions}>
        {
          take(actions, 5).map(action => (
            <CommandPaletteAction key={action.id} {...action} /> 
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
