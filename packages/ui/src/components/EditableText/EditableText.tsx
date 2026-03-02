import { ComponentProps, FC } from 'react';

import { cn } from '../../utils';

type EditableTextProps = Omit<ComponentProps<'div'>, 'onSave'> & {
  value: string;
  onSave: (newValue: string) => void;
  variant?: 'input' | 'textarea';
  placeholder?: string;
  textClassName?: string;
  disabled?: boolean;
  maxLength?: number;
  'data-testid'?: string;
};

export const EditableText: FC<EditableTextProps> = ({
  value,
  onSave: _onSave,
  variant: _variant,
  placeholder,
  className,
  textClassName,
  disabled: _disabled,
  maxLength: _maxLength,
  'data-testid': testId,
  ...props
}) => {
  return (
    <div className={cn('relative', className)} data-testid={testId} {...props}>
      <div
        data-testid={testId ? `${testId}-display` : undefined}
        className={cn(
          'cursor-text rounded px-2 py-1',
          textClassName,
          !value && placeholder && 'text-foreground-secondary',
        )}
      >
        {value || placeholder}
      </div>
    </div>
  );
};
