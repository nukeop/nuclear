import { FC } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

type ToasterProps = {
  position?:
    | 'top-left'
    | 'top-right'
    | 'top-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-center';
  richColors?: boolean;
  expand?: boolean;
  closeButton?: boolean;
};

const ToasterImpl: FC<ToasterProps> = ({
  position = 'bottom-right',
  richColors = false,
  expand = false,
  closeButton = false,
}) => {
  return (
    <SonnerToaster
      style={{ fontFamily: 'inherit', overflowWrap: 'anywhere' }}
      position={position}
      richColors={richColors}
      expand={expand}
      closeButton={closeButton}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'bg-background text-foreground border-border border-(length:--border-width) font-bold shadow-shadow rounded-md text-sm flex items-center gap-2 p-4 w-80 [&:has(button)]:justify-between select-none',
          description: 'font-normal',
          actionButton:
            'font-normal border-(length:--border-width) text-smh-6 px-2 bg-primary text-foreground border-border rounded-md shrink-0',
          cancelButton:
            'font-normal border-(length:--border-width) text-sm h-6 px-2 bg-background-secondary text-foreground border-border rounded-md shrink-0',
          loading:
            '[&[data-sonner-toast]_[data-icon]]:flex [&[data-sonner-toast]_[data-icon]]:size-4 [&[data-sonner-toast]_[data-icon]]:relative [&[data-sonner-toast]_[data-icon]]:justify-start [&[data-sonner-toast]_[data-icon]]:items-center [&[data-sonner-toast]_[data-icon]]:flex-shrink-0',
          success:
            '!bg-accent-green !text-foreground !border-(length:--border-width) !border-border',
          error:
            '!bg-accent-red !text-foreground !border-(length:--border-width) !border-border',
          warning:
            '!bg-accent-orange !text-foreground !border-(length:--border-width) !border-border',
          info: '!bg-accent-cyan !text-foreground !border-(length:--border-width) !border-border',
        },
      }}
    />
  );
};

export const Toaster = ToasterImpl;
