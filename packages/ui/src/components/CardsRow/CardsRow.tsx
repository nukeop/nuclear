import isEmpty from 'lodash-es/isEmpty';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { FC } from 'react';

import { cn } from '../../utils';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Card } from '../Card';
import { Input } from '../Input';
import { useCardsRow } from './useCardsRow';

export type CardsRowItem = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  onClick?: () => void;
};

export type CardsRowLabels = {
  filterPlaceholder: string;
  nothingFound: string;
};

export type CardsRowProps = {
  title: string;
  badge?: string;
  items: CardsRowItem[];
  labels: CardsRowLabels;
  className?: string;
  'data-testid'?: string;
};

export const CardsRow: FC<CardsRowProps> = ({
  title,
  badge,
  items,
  labels,
  className,
  'data-testid': testId = 'cards-row',
}) => {
  const {
    filterText,
    setFilterText,
    clearFilter,
    filteredItems,
    scrollContainerRef,
    scrollLeft,
    scrollRight,
  } = useCardsRow(items);

  return (
    <div data-testid={testId} className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-foreground text-lg font-bold">{title}</h2>
          {badge && (
            <Badge data-testid="cards-row-badge" variant="pill" color="purple">
              {badge}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Input
            data-testid="cards-row-filter"
            size="sm"
            tone="secondary"
            placeholder={labels.filterPlaceholder}
            value={filterText}
            onChange={(event) => setFilterText(event.target.value)}
            endAddon={
              <button
                data-testid="cards-row-clear-filter"
                type="button"
                className="text-foreground cursor-pointer"
                onClick={clearFilter}
              >
                <Filter size={14} />
              </button>
            }
          />
          <div className="flex items-center gap-2">
            <Button
              data-testid="cards-row-scroll-left"
              size="icon"
              onClick={scrollLeft}
              variant="noShadow"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              data-testid="cards-row-scroll-right"
              size="icon"
              onClick={scrollRight}
              variant="noShadow"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="scrollbar-hide flex gap-2 overflow-x-auto overflow-y-visible [scroll-behavior:smooth] pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {isEmpty(filteredItems) ? (
          <div
            data-testid="cards-row-nothing-found"
            className="text-foreground/60 py-8 text-sm"
          >
            {labels.nothingFound}
          </div>
        ) : (
          filteredItems.map((item) => (
            <Card
              key={item.id}
              className="flex-shrink-0"
              src={item.imageUrl}
              title={item.title}
              subtitle={item.subtitle}
              onClick={item.onClick}
            />
          ))
        )}
      </div>
    </div>
  );
};
