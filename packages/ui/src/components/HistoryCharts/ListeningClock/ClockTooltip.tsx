import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import { FC } from 'react';
import { createPortal } from 'react-dom';

import { ChartTooltip } from '../ChartTooltip';

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
    <ChartTooltip
      ref={refs.setFloating}
      testId="listening-clock-tooltip"
      style={floatingStyles}
      value={value}
      label={label}
    />,
    document.body,
  );
};
