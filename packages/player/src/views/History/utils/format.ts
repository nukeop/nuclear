import { Duration } from 'luxon';

export const formatListeningDuration = (ms: number): string => {
  const { hours, minutes = 0 } = Duration.fromMillis(ms)
    .shiftTo('minutes')
    .mapUnits(Math.round)
    .rescale()
    .toObject();

  if (!hours) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
};
