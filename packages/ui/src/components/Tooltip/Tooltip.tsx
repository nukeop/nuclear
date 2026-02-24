import {
  FC,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../utils';

type TooltipProps = PropsWithChildren<{
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  disabled?: boolean;
  className?: string;
}>;

const OFFSET = 12;

const getTooltipStyle = (
  rect: DOMRect,
  side: 'top' | 'right' | 'bottom' | 'left',
): React.CSSProperties => {
  switch (side) {
    case 'right':
      return {
        top: rect.top + rect.height / 2,
        left: rect.right + OFFSET,
        transform: 'translateY(-50%)',
      };
    case 'left':
      return {
        top: rect.top + rect.height / 2,
        left: rect.left - OFFSET,
        transform: 'translate(-100%, -50%)',
      };
    case 'top':
      return {
        top: rect.top - OFFSET,
        left: rect.left + rect.width / 2,
        transform: 'translate(-50%, -100%)',
      };
    case 'bottom':
      return {
        top: rect.bottom + OFFSET,
        left: rect.left + rect.width / 2,
        transform: 'translateX(-50%)',
      };
  }
};

export const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  side = 'right',
  disabled = false,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setStyle(getTooltipStyle(rect, side));
    }
    setIsVisible(true);
  }, [side]);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <div
      ref={triggerRef}
      className="relative"
      onMouseEnter={disabled ? undefined : show}
      onMouseLeave={disabled ? undefined : hide}
    >
      {children}
      {isVisible &&
        !disabled &&
        createPortal(
          <div
            role="tooltip"
            style={style}
            className={cn(
              'border-border bg-background text-foreground shadow-shadow pointer-events-none fixed z-50 rounded-md border-2 px-2 py-1 text-sm whitespace-nowrap',
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
