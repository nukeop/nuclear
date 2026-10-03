import { ListboxOption } from '@headlessui/react';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';

type SelectOptionClasses = { root?: string; selectedCheckmark?: string };

type SelectOptionProps = {
  id: string;
  label: string;
  icon?: ReactNode;
  as?: React.ElementType;
  children?: ReactNode;
  classes?: SelectOptionClasses;
};

export const SelectOption: FC<SelectOptionProps> = ({
  id,
  label,
  icon,
  as = 'li',
  children,
  classes,
}) => {
  return (
    <ListboxOption value={id} as={as}>
      {({ focus, selected }) => (
        <div
          className={cn(
            'cursor-pointer p-1',
            focus && 'outline-border outline-2',
            classes?.root,
          )}
          onMouseDown={(e) => e.preventDefault()}
        >
          <span className="relative inline-flex w-full flex-row items-center justify-between">
            {children ?? (
              <span className="flex items-center gap-2">
                {icon}
                {label}
              </span>
            )}
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
