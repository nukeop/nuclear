import { ListboxOption } from '@headlessui/react';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';

type SelectOptionClasses = { root?: string; selectedCheckmark?: string };

type SelectOptionProps = {
  id: string;
  label: string;
  as?: React.ElementType;
  children?: ReactNode;
  classes?: SelectOptionClasses;
};

export const SelectOption: FC<SelectOptionProps> = ({
  id,
  label,
  as = 'li',
  children,
  classes,
}) => {
  return (
    <ListboxOption value={id} as={as}>
      {({ focus, selected }) => (
        <div
          className={cn(
            'text-foreground cursor-pointer p-1',
            focus && 'outline-border outline-2',
            classes?.root,
          )}
          onMouseDown={(e) => e.preventDefault()}
        >
          <span className="relative inline-flex w-full flex-row items-center justify-between">
            {children ?? label}
            {selected && (
              <span
                className={cn('flex items-center', classes?.selectedCheckmark)}
              >
                ✓
              </span>
            )}
          </span>
        </div>
      )}
    </ListboxOption>
  );
};
