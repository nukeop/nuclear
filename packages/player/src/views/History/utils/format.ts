import { DateTime, Duration } from 'luxon';

export const formatHour = (hour: number): string =>
  DateTime.fromObject({ hour }).toLocaleString(DateTime.TIME_SIMPLE);

export const formatListeningDuration = (ms: number): string => {
  const minutes = Duration.fromMillis(ms)
    .shiftTo('minutes')
    .mapUnits(Math.round);

  if (minutes.valueOf() === 0) {
    return minutes.toHuman({ unitDisplay: 'narrow' });
  }
  return minutes.rescale().toHuman({ unitDisplay: 'narrow' });
};
