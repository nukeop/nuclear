import { FC, PropsWithChildren, ReactNode } from 'react';

import { DialogActions } from './DialogActions';
import { DialogClose } from './DialogClose';
import { DialogDescription } from './DialogDescription';
import { DialogOverlayBackdrop } from './DialogOverlayBackdrop';
import { DialogRoot } from './DialogRoot';
import { DialogTitle } from './DialogTitle';
import { DialogXClose } from './DialogXClose';

type DialogProps = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  actions?: ReactNode;
}>;

type DialogComponent = FC<DialogProps> & {
  Root: typeof DialogRoot;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
  Actions: typeof DialogActions;
  Close: typeof DialogClose;
  XClose: typeof DialogXClose;
  Backdrop: typeof DialogOverlayBackdrop;
};

const DialogImpl: FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
}) => (
  <DialogRoot isOpen={isOpen} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    {description && <DialogDescription>{description}</DialogDescription>}
    {children}
    {actions && <DialogActions>{actions}</DialogActions>}
  </DialogRoot>
);

export const Dialog = DialogImpl as DialogComponent;
Dialog.Root = DialogRoot;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Actions = DialogActions;
Dialog.Close = DialogClose;
Dialog.XClose = DialogXClose;
Dialog.Backdrop = DialogOverlayBackdrop;
