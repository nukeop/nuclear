import React from 'react';
import { useTranslation } from 'react-i18next';
import { isMac } from '../../hooks/usePlatform';
import styles from './styles.scss';

const CommandPaletteReminder = () => {
  const { t } = useTranslation('command-palette');

  return (
    <div className={styles.command_palette_reminder}>
      <p><kbd>
        {isMac() ? '⌘' : 'ctrl'} + K
      </kbd>{t('reminder')}</p>
    </div>
  );
};

export default CommandPaletteReminder;
