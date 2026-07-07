import { History, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { FC, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { cn, Popover } from '@nuclearplayer/ui';

const highlightClasses = 'bg-background-secondary border-border';

type SearchBoxPopoverProps = {
  isOpen: boolean;
  recentSearches: string[];
  highlightedIndex: number;
  onHighlight: (index: number) => void;
  onSelect: (query: string) => void;
  onClearHistory: () => void;
};

const keepFocus = (event: MouseEvent) => event.preventDefault();

export const SearchBoxPopover: FC<SearchBoxPopoverProps> = ({
  isOpen,
  recentSearches,
  highlightedIndex,
  onHighlight,
  onSelect,
  onClearHistory,
}) => {
  const { t } = useTranslation('search');
  const clearIndex = recentSearches.length;
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
            <Popover.Section label={t('recentSearches')}>
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
                  onMouseEnter={() => onHighlight(index)}
                  onMouseDown={keepFocus}
                  onClick={() => onSelect(recentSearch)}
                >
                  {recentSearch}
                </Popover.Item>
              ))}
            </Popover.Section>
            <Popover.Footer>
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
                onMouseEnter={() => onHighlight(clearIndex)}
                onMouseDown={keepFocus}
                onClick={onClearHistory}
              >
                {t('clearRecentSearches')}
              </Popover.Item>
            </Popover.Footer>
          </Popover.Menu>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
