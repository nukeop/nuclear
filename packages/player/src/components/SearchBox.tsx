import { Search, X } from 'lucide-react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Input } from '@nuclearplayer/ui';

import { useSearchBox } from './useSearchBox';

export const SearchBox: FC = () => {
  const { t } = useTranslation('search');
  const { query, setQuery, inputRef, handleKeyDown, clear } = useSearchBox();

  return (
    <div className="relative w-full">
      <Search className="text-foreground-secondary pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
      <Input
        ref={inputRef}
        data-testid="search-box"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('placeholder')}
        tone="secondary"
        className="h-8 px-8"
      />
      {query.length > 0 && (
        <Button
          data-testid="search-box-clear"
          variant="text"
          onClick={clear}
          className="absolute top-1/2 right-1 size-6 -translate-y-1/2 justify-center p-0"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
};
