import { VariantProps } from 'class-variance-authority';
import { createContext, useContext } from 'react';

import { SelectOption, selectVariants } from '.';

type SelectContextValue = {
  ids: {
    selectId: string;
    labelId: string;
    descriptionId: string;
    errorId: string;
    listboxId: string;
  };
  value: string;
  placeholder?: string;
  size?: VariantProps<typeof selectVariants>['size'];
  disabled?: boolean;
  state: 'normal' | 'error';
  describedBy?: string;
  hasLabel: boolean;
  hasDescription: boolean;
  hasError: boolean;
  open: boolean;
  selected?: SelectOption;
  buttonClassName?: string;
};

export const SelectContext = createContext<SelectContextValue | null>(null);

export const useSelectContext = () => {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    throw new Error('Select.* must be used within <Select.Root>');
  }
  return ctx;
};
