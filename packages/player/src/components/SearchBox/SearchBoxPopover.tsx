import { History, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { FC, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Popover } from '@nuclearplayer/ui';

import { useSearchPopover } from './useSearchPopover';

type SearchBoxPopoverProps = {
  isOpen: boolean;
};

const keepFocus = (event: MouseEvent) => event.preventDefault();

export const SearchBoxPopover: FC<SearchBoxPopoverProps> = ({ isOpen }) => {
  const { t } = useTranslation('search');
  const { recentSearches, clearRecentSearches, navigateToSearch } =
    useSearchPopover();
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
            {recentSearches.map((recentSearch) => (
              <Popover.Item
                key={recentSearch}
                icon={<History size={16} />}
                data-testid="search-box-recent-search"
                onMouseDown={() => navigateToSearch(recentSearch)}
              >
                {recentSearch}
              </Popover.Item>
            ))}
            <Popover.Item
              intent="danger"
              align="center"
              icon={<Trash2 size={16} />}
              data-testid="search-box-clear-history"
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
