import { GripVertical } from 'lucide-react';
import { ComponentProps, forwardRef } from 'react';

import { cn } from '../../utils';

type CardDragHandleProps = ComponentProps<'div'>;

export const CardDragHandle = forwardRef<HTMLDivElement, CardDragHandleProps>(
  ({ className, ...props }, ref) => (
    <div
      data-testid="card-drag-handle"
      ref={ref}
      className={cn(
        'surface-card border-border absolute top-1/2 -left-3.5 flex h-12 w-3.5 -translate-y-1/2 cursor-grab items-center justify-center rounded-l-md border-(length:--border-width) border-r-0 bg-clip-padding transition-all active:cursor-grabbing',
        className,
      )}
      {...props}
    >
      <GripVertical size={12} absoluteStrokeWidth className="shrink-0" />
    </div>
  ),
);

CardDragHandle.displayName = 'CardDragHandle';
