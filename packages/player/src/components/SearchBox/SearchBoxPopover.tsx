import { AnimatePresence, motion } from 'motion/react';
import { FC } from 'react';

type SearchBoxPopoverProps = {
  isOpen: boolean;
  recentSearches: string[];
};

export const SearchBoxPopover: FC<SearchBoxPopoverProps> = ({
  isOpen,
  recentSearches,
}) => (
  <AnimatePresence>
    {isOpen && (
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
        className="bg-primary border-border absolute top-full right-0 left-0 z-50 mt-2 rounded-md border-(length:--border-width) p-2"
      >
        {recentSearches.map((recentSearch, index) => (
          <div
            key={`${index}-${recentSearch}`}
            data-testid="search-box-recent-search"
            className="text-foreground rounded-sm px-2 py-1.5 text-sm"
          >
            {recentSearch}
          </div>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);
