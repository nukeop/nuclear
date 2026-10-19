import { CardGridBase } from './CardGridBase';
import { CardGridSkeleton } from './CardGridSkeleton';
import { SortableCardGrid } from './SortableCardGrid';
import { SortableCardGridItem } from './SortableCardGridItem';

export const CardGrid = Object.assign(CardGridBase, {
  Skeleton: CardGridSkeleton,
  Sortable: SortableCardGrid,
  SortableItem: SortableCardGridItem,
});
