import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as Mousetrap from 'mousetrap';

import { CommandPalette } from '@nuclear/ui';
import { Input } from 'semantic-ui-react';

export const CommandPaletteContainer: React.FC = () => {
  const { t } = useTranslation('command-palette');
  const [isOpen, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
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


  return <CommandPalette
    searchPlaceholder={t('search-placeholder')}
    emptyStateText={t('empty-state-help')}  
    protipText={t('protip-text')}
    protipContent={t('protip-content')}

    actions={[]}
    inputValue={input}
    onInputChange={text => setInput(text)}

    isOpen={isOpen}
    onClose={() => setOpen(false)}
    inputRef={inputRef}
  />;
};
