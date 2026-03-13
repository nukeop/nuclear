import { FC } from 'react';

import { CopyButton } from '@nuclearplayer/ui';

type Props = {
  label: string;
  description?: string;
  value: string | undefined;
};

export const InfoField: FC<Props> = ({ label, description, value }) => (
  <div className="flex flex-col gap-2">
    <span className="text-foreground text-sm font-semibold">{label}</span>
    <div className="flex items-center gap-2">
      <div
        data-testid="info-field-value"
        className="border-border bg-background-input flex-1 rounded-md border-(length:--border-width) px-3 py-2 font-mono text-sm"
      >
        {value}
      </div>
      <CopyButton
        data-testid="info-field-copy-button"
        text={value ?? ''}
        variant="ghost"
      />
    </div>
    {description && (
      <p className="text-foreground-secondary text-sm select-none">
        {description}
      </p>
    )}
  </div>
);
