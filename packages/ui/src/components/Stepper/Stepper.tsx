import isNil from 'lodash-es/isNil';
import { ComponentProps, FC, ReactNode } from 'react';

import { cn } from '../../utils';
import { StepperButton } from './StepperButton';

type StepperLabels = {
  decrement: string;
  increment: string;
};

type StepperProps = Omit<ComponentProps<'div'>, 'children'> & {
  value?: ReactNode;
  decrementIcon: ReactNode;
  incrementIcon: ReactNode;
  onDecrement: () => void;
  onIncrement: () => void;
  isDecrementDisabled?: boolean;
  isIncrementDisabled?: boolean;
  labels: StepperLabels;
};

export const Stepper: FC<StepperProps> = ({
  value,
  decrementIcon,
  incrementIcon,
  onDecrement,
  onIncrement,
  isDecrementDisabled,
  isIncrementDisabled,
  labels,
  className,
  ...props
}) => (
  <div
    className={cn(
      'border-border bg-muted text-muted-foreground divide-border flex h-8 divide-x-(--border-width) overflow-hidden rounded-md border-(length:--border-width)',
      className,
    )}
    {...props}
  >
    <StepperButton
      label={labels.decrement}
      onClick={onDecrement}
      disabled={isDecrementDisabled}
    >
      {decrementIcon}
    </StepperButton>
    {!isNil(value) && (
      <span className="flex min-w-12 items-center justify-center px-1 text-xs font-bold tabular-nums">
        {value}
      </span>
    )}
    <StepperButton
      label={labels.increment}
      onClick={onIncrement}
      disabled={isIncrementDisabled}
    >
      {incrementIcon}
    </StepperButton>
  </div>
);
