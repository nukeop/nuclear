import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import { FC, PropsWithChildren, ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../utils';

const TOOLTIP_OFFSET_PX = 12;
const VIEWPORT_PADDING_PX = 8;

type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

type TooltipProps = PropsWithChildren<{
  content: ReactNode;
  side?: TooltipSide;
  disabled?: boolean;
  className?: string;
}>;

export const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  side = 'right',
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles } = useFloating({
    placement: side,
    open: isOpen,
    middleware: [
      offset(TOOLTIP_OFFSET_PX),
      flip(),
      shift({ padding: VIEWPORT_PADDING_PX }),
    ],
    whileElementsMounted: autoUpdate,
  });

  return (
    <div
      ref={refs.setReference}
      onMouseEnter={disabled ? undefined : () => setIsOpen(true)}
      onMouseLeave={disabled ? undefined : () => setIsOpen(false)}
    >
      {children}
      {isOpen &&
        !disabled &&
        createPortal(
          <div
            ref={refs.setFloating}
            role="tooltip"
            style={floatingStyles}
            className={cn(
              'border-border bg-background text-foreground shadow-shadow pointer-events-none z-50 rounded-md border-(length:--border-width) px-2 py-1 text-sm whitespace-nowrap',
              className,
            )}
          >
            {content}
          </div>,
          document.body,
        )}
    </div>
  );
};
