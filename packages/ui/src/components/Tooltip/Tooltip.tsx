import { FC, PropsWithChildren, ReactNode, useState } from 'react';

import { cn } from '../../utils';

type TooltipProps = PropsWithChildren<{
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  disabled?: boolean;
  className?: string;
}>;

const SIDE_CLASSES = {
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
};

export const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  side = 'right',
  disabled = false,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'border-border bg-background text-foreground shadow-shadow pointer-events-none absolute z-50 rounded-md border-2 px-2 py-1 text-sm whitespace-nowrap',
            SIDE_CLASSES[side],
            className,
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
