import { History, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { FC, MouseEvent, RefObject } from 'react';
import { useTranslation } from 'react-i18next';

import { cn, Popover } from '@nuclearplayer/ui';

import { useSearchPopover } from './useSearchPopover';

const highlightClasses = 'bg-background-secondary border-border';

type SearchBoxPopoverProps = {
  isOpen: boolean;
  inputRef: RefObject<HTMLInputElement>;
};

const keepFocus = (event: MouseEvent) => event.preventDefault();

export const SearchBoxPopover: FC<SearchBoxPopoverProps> = ({
  isOpen,
  inputRef,
}) => {
  const { t } = useTranslation('search');
  const {
    recentSearches,
    clearRecentSearches,
    navigateToSearch,
    highlightedIndex,
    setHighlightedIndex,
    clearIndex,
  } = useSearchPopover(inputRef, isOpen);
  const hasHistory = recentSearches.length > 0;

  return (
    <AnimatePresence>
      {isOpen && hasHistory && (
        <motion.div
          data-testid="search-box-popover"
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 17,
            mass: 0.8,
          }}
          className="bg-background border-border absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-md border-(length:--border-width)"
        >
          <Popover.Menu>
            {recentSearches.map((recentSearch, index) => (
              <Popover.Item
                key={recentSearch}
                icon={<History size={16} />}
                highlight="controlled"
                data-testid="search-box-recent-search"
                data-highlighted={index === highlightedIndex}
                className={cn({
                  [highlightClasses]: index === highlightedIndex,
                })}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={() => navigateToSearch(recentSearch)}
              >
                {recentSearch}
              </Popover.Item>
            ))}
            <Popover.Item
              intent="danger"
              align="center"
              highlight="controlled"
              icon={<Trash2 size={16} />}
              data-testid="search-box-clear-history"
              data-highlighted={clearIndex === highlightedIndex}
              className={cn({
                [highlightClasses]: clearIndex === highlightedIndex,
              })}
              onMouseEnter={() => setHighlightedIndex(clearIndex)}
              onMouseDown={keepFocus}
              onClick={clearRecentSearches}
            >
              {t('clearRecentSearches')}
            </Popover.Item>
          </Popover.Menu>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
