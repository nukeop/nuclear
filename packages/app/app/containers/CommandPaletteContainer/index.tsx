import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Mousetrap from 'mousetrap';

import { CommandPalette } from '@nuclear/ui';
import { Input } from 'semantic-ui-react';
import { useCommandPaletteActions } from './hooks';

export const CommandPaletteContainer: React.FC = () => {
  const { t } = useTranslation('command-palette');
  const [isOpen, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef<Input>();

  useEffect(() => {
    Mousetrap.bind(['command+k', 'ctrl+k'], () => {
      setOpen(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return false;
    });

    return () => {
      Mousetrap.unbind(['command+k', 'ctrl+k']);
    };
  }, [inputRef]);

  const actions = useCommandPaletteActions()
    .filter(action => action.name.toLowerCase().includes(input.toLowerCase()));

  return <CommandPalette
    searchPlaceholder={t('search-placeholder')}
    emptyStateText={t('empty-state-help')}  
    protipText={t('protip-text')}
    protipContent={t('protip-content')}

    actions={actions}
    inputValue={input}
    onInputChange={text => setInput(text)}

    isOpen={isOpen}
    onClose={() => {
      setOpen(false);
      setInput('');
    }}
    inputRef={inputRef}
  />;
};
