import React from 'react';

import styles from './styles.scss';

type CommandPaletteFooterProps = {
    protipText?: string;
    protipContent?: string;
}

export const CommandPaletteFooter: React.FC<CommandPaletteFooterProps> = ({
  protipText,
  protipContent
}) => (protipText && protipContent) 
  ? <footer className={styles.command_palette_footer}>
    <div className={styles.protip}>
      <div className={styles.protip_text}>
        {protipText}
      </div>
      <div className={styles.protip_content}>
        {protipContent}
      </div>
    </div>
  </footer>
  : null;
