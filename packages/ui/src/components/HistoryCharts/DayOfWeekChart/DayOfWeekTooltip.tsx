import { FC } from 'react';

type DayOfWeekTooltipProps = {
  active?: boolean;
  payload?: { payload: { weekday: string; value: number } }[];
  formatValue: (value: number) => string;
};

export const DayOfWeekTooltip: FC<DayOfWeekTooltipProps> = ({
  active,
  payload,
  formatValue,
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  const { weekday, value } = payload[0].payload;

  return (
    <div
      role="tooltip"
      className="border-border bg-background-secondary shadow-shadow pointer-events-none z-50 flex flex-col gap-0.5 rounded-sm border-(length:--border-width) px-2 py-1 whitespace-nowrap"
    >
      <span className="font-heading text-sm leading-none font-extrabold">
        {formatValue(value)}
      </span>
      <span className="text-foreground-secondary font-mono text-[10px]">
        {weekday}
      </span>
    </div>
  );
};
