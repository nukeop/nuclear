import { CSSProperties, forwardRef } from 'react';

type ChartTooltipProps = {
  value: string;
  label: string;
  style?: CSSProperties;
  testId?: string;
};

export const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ value, label, style, testId }, ref) => (
    <div
      ref={ref}
      role="tooltip"
      data-testid={testId}
      style={style}
      className="border-border bg-muted shadow-shadow pointer-events-none z-50 flex flex-col gap-0.5 rounded-sm border-(length:--border-width) px-2 py-1 whitespace-nowrap"
    >
      <span className="font-heading text-sm leading-none font-extrabold">
        {value}
      </span>
      <span className="text-foreground-secondary font-mono text-[10px]">
        {label}
      </span>
    </div>
  ),
);

ChartTooltip.displayName = 'ChartTooltip';
