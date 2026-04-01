import { cva, type VariantProps } from 'class-variance-authority';
import { FC } from 'react';

import { SelectButton } from './SelectButton';
import { SelectDescription } from './SelectDescription';
import { SelectError } from './SelectError';
import { SelectLabel } from './SelectLabel';
import { SelectOption as SelectOptionComponent } from './SelectOption';
import { SelectOptions } from './SelectOptions';
import { SelectRoot } from './SelectRoot';

export const selectVariants = cva(
  'border-border bg-primary text-foreground relative flex w-full items-center justify-between rounded-md border-(length:--border-width) px-3 pr-8 text-left transition-colors focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'px-3 py-2 text-sm',
      },
      state: {
        normal: '',
        error: 'border-accent-red',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'normal',
    },
  },
);

export type SelectOption = { id: string; label: string };

export type SelectProps = VariantProps<typeof selectVariants> & {
  id?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

type SelectComponent = FC<SelectProps> & {
  Root: typeof SelectRoot;
  Label: typeof SelectLabel;
  Button: typeof SelectButton;
  Options: typeof SelectOptions;
  Option: typeof SelectOptionComponent;
  Description: typeof SelectDescription;
  Error: typeof SelectError;
};

const SelectImpl: FC<SelectProps> = ({
  id,
  label,
  description,
  error,
  placeholder,
  options,
  value,
  defaultValue,
  onValueChange,
  size,
  className,
  disabled,
}) => {
  return (
    <div className="relative flex w-full flex-col gap-2">
      <SelectRoot
        id={id}
        label={label}
        description={description}
        error={error}
        placeholder={placeholder}
        options={options}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        size={size}
        className={className}
        disabled={disabled}
      >
        <SelectLabel label={label} />
        <SelectButton />
        <SelectOptions>
          {options.map((opt) => (
            <SelectOptionComponent
              key={opt.id}
              id={opt.id}
              label={opt.label}
              as="li"
            />
          ))}
        </SelectOptions>
        <SelectDescription description={description} />
        <SelectError error={error} />
      </SelectRoot>
    </div>
  );
};

export const Select = SelectImpl as SelectComponent;
Select.Root = SelectRoot;
Select.Label = SelectLabel;
Select.Button = SelectButton;
Select.Options = SelectOptions;
Select.Option = SelectOptionComponent;
Select.Description = SelectDescription;
Select.Error = SelectError;
