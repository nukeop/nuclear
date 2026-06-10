import { PopoverButton } from '@headlessui/react';
import { FC, MouseEvent, ReactNode, useRef } from 'react';

export const ContextMenuTrigger: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    buttonRef.current?.click();
  };

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <PopoverButton as="div" ref={buttonRef} className="cursor-pointer">
      <div onContextMenu={handleContextMenu} onClick={handleClick}>
        {children}
      </div>
    </PopoverButton>
  );
};
