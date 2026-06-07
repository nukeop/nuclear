import { FC, ReactNode, useRef } from 'react';

import { Popover } from '../Popover';

type QueueItemPopoverProps = {
  children: ReactNode;
  content: ReactNode;
};

export const QueueItemPopover: FC<QueueItemPopoverProps> = ({
  children,
  content,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <Popover
      anchor="left"
      trigger={
        <div
          ref={triggerRef}
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            triggerRef.current?.click();
          }}
        >
          {children}
        </div>
      }
    >
      {content}
    </Popover>
  );
};
