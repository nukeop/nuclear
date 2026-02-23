import { XIcon } from 'lucide-react';
import { FC } from 'react';

import { cn } from '../../utils';
import { Button } from '../Button';
import { useDialogContext } from './context';

type DialogXCloseProps = {
  className?: string;
};

export const DialogXClose: FC<DialogXCloseProps> = ({ className }) => {
  const { onClose } = useDialogContext();

  return (
    <Button
      variant="text"
      size="icon-sm"
      onClick={onClose}
      className={cn('absolute top-3 right-3', className)}
      aria-label="Close"
      data-testid="dialog-x-close"
    >
      <XIcon size={16} />
    </Button>
  );
};
