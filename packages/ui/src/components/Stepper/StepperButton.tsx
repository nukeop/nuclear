import { ComponentProps, FC } from 'react';

import { cn } from '../../utils';

type StepperButtonProps = Omit<ComponentProps<'button'>, 'aria-label'> & {
  label: string;
};

export const StepperButton: FC<StepperButtonProps> = ({
  label,
  className,
  ...props
}) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={cn(
      'flex w-7 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-40',
      className,
    )}
    {...props}
  />
);
