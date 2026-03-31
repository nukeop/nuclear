import { ListboxButton } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { FC } from 'react';

import { selectVariants } from '.';
import { cn } from '../../utils';
import { useSelectContext } from './context';

export const SelectButton: FC = () => {
  const {
    ids: { selectId, listboxId, labelId },
    size,
    state,
    describedBy,
    hasLabel,
    hasError,
    placeholder,
    selected,
    open,
    disabled,
    buttonClassName,
  } = useSelectContext();
  return (
    <ListboxButton
      id={selectId}
      as="button"
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={listboxId}
      aria-labelledby={hasLabel ? labelId : undefined}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
      aria-errormessage={hasError ? `${selectId}-error` : undefined}
      disabled={disabled}
      className={cn(
        selectVariants({ size, state, className: buttonClassName }),
      )}
    >
      <span className="block truncate">{selected?.label ?? placeholder}</span>
      <span className="flex items-center">
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn(
            'text-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </span>
    </ListboxButton>
  );
};
