import { Duration } from 'luxon';

export const formatListeningDuration = (ms: number): string => {
  const { hours, minutes } = Duration.fromMillis(ms)
    .shiftTo('hours', 'minutes')
    .toObject();
  const wholeMinutes = Math.round(minutes ?? 0);
  if (!hours) {
    return `${wholeMinutes}m`;
  }
  return `${hours}h ${wholeMinutes}m`;
};
