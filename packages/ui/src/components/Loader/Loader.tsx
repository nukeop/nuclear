import { cva, VariantProps } from 'class-variance-authority';
import { LoaderPinwheel } from 'lucide-react';
import { FC } from 'react';

const loaderVariants = cva('', {
  variants: {
    size: {
      default: 24,
      sm: 16,
      lg: 32,
      xl: 48,
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type LoaderProps = {
  'data-testid'?: string;
} & VariantProps<typeof loaderVariants>;

export const Loader: FC<LoaderProps> = ({
  size,
  'data-testid': dataTestId = 'loader',
}) => (
  <LoaderPinwheel
    size={loaderVariants({ size })}
    className="animate-spin"
    data-testid={dataTestId}
  />
);
