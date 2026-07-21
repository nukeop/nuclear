import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import { FC } from 'react';
import { createPortal } from 'react-dom';

type ClockTooltipProps = {
  anchor: SVGPathElement;
  value: string;
  label: string;
};

export const ClockTooltip: FC<ClockTooltipProps> = ({
  anchor,
  value,
  label,
}) => {
  const { refs, floatingStyles } = useFloating({
    placement: 'right',
    elements: { reference: anchor },
    middleware: [offset(12), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  return createPortal(
    <div
      ref={refs.setFloating}
      role="tooltip"
      data-testid="listening-clock-tooltip"
      style={floatingStyles}
      className="border-border bg-background-secondary shadow-shadow pointer-events-none z-50 flex flex-col gap-0.5 rounded-sm border-(length:--border-width) px-2 py-1 whitespace-nowrap"
    >
      <span className="font-heading text-sm leading-none font-extrabold">
        {value}
      </span>
      <span className="text-foreground-secondary font-mono text-[10px]">
        {label}
      </span>
    </div>,
    document.body,
  );
};
