import { LucideIcon } from 'lucide-react';
import { ComponentProps, FC, ReactNode } from 'react';

import { Badge } from '@nuclearplayer/ui';

type ProviderPillProps = {
  Icon: LucideIcon;
  color: ComponentProps<typeof Badge>['color'];
  children?: ReactNode;
  className?: string;
  'data-testid'?: string;
};

export const ProviderPill: FC<ProviderPillProps> = ({
  Icon,
  color,
  children,
  className,
  'data-testid': dataTestId,
}) => (
  <Badge
    variant="pill"
    color={color}
    className={`gap-1 ${className ?? ''}`}
    data-testid={dataTestId}
  >
    <Icon size={10} />
    {children}
  </Badge>
);
