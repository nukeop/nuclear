import groupBy from 'lodash-es/groupBy';
import { DateTime } from 'luxon';

import type { HistoryEntry } from '../../../services/tauri/bindings';

export type DayGroup = {
  day: DateTime;
  entries: HistoryEntry[];
};

export const groupEntriesByDay = (entries: HistoryEntry[]): DayGroup[] => {
  const byIsoDate = groupBy(entries, (entry) =>
    DateTime.fromMillis(entry.startedAt).toISODate(),
  );

  return Object.entries(byIsoDate).map(([isoDate, dayEntries]) => ({
    day: DateTime.fromISO(isoDate),
    entries: dayEntries,
  }));
};
