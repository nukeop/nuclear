import { FC, PropsWithChildren } from 'react';

import { Button } from '../Button';
import { useDialogContext } from './context';

export const DialogClose: FC<PropsWithChildren> = ({ children }) => {
  const { onClose } = useDialogContext();
  return (
    <Button className="bg-muted" onClick={onClose} data-testid="dialog-close">
      {children}
    </Button>
  );
};
