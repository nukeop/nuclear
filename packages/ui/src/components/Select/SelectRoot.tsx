import { Listbox } from '@headlessui/react';
import { FC, PropsWithChildren, useId, useMemo, useState } from 'react';

import { SelectProps } from '.';
import { SelectContext } from './context';

type SelectRootProps = PropsWithChildren<
  Omit<SelectProps, 'className'> & {
    className?: string;
  }
>;

export const SelectRoot: FC<SelectRootProps> = ({
  id,
  disabled,
  options,
  value,
  defaultValue,
  placeholder,
  onValueChange,
  size,
  label,
  description,
  error,
  className,
  children,
}) => {
  const reactId = useId();
  const selectId = id ?? `select-${reactId}`;
  const labelId = `${selectId}-label`;
  const descriptionId = `${selectId}-description`;
  const errorId = `${selectId}-error`;
  const listboxId = `${selectId}-listbox`;

  const hasLabel = !!label;
  const hasDescription = !!description;
  const hasError = !!error;

  const describedBy = [
    hasDescription ? descriptionId : null,
    hasError ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ');

  const state = hasError ? 'error' : 'normal';

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string | undefined>(
    defaultValue ?? (placeholder ? undefined : options[0]?.id),
  );
  const currentValue = (isControlled ? value : internal) ?? '';
  const selected = useMemo(
    () => options.find((option) => option.id === currentValue),
    [currentValue, options],
  );

  const commit = (val: string) => {
    if (!isControlled) {
      setInternal(val);
    }
    onValueChange?.(val);
  };

  return (
    <Listbox value={currentValue} onChange={commit} disabled={disabled}>
      {({ open }) => (
        <SelectContext.Provider
          value={{
            ids: { selectId, labelId, descriptionId, errorId, listboxId },
            value: currentValue,
            placeholder,
            size,
            disabled,
            state,
            describedBy: describedBy || undefined,
            hasLabel,
            hasDescription,
            hasError,
            open,
            selected,
            buttonClassName: className,
          }}
        >
          {children}
        </SelectContext.Provider>
      )}
    </Listbox>
  );
};
