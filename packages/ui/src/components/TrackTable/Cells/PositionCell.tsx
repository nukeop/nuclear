import type { CellContext } from '@tanstack/react-table';
import type { LegacyFeatures } from '@tanstack/react-table/legacy';

import { Track } from '@nuclearplayer/model';

export const PositionCell = <T extends Track>(
  context: CellContext<LegacyFeatures, T, number>,
) => <td className="min-w-10 text-center">{context.getValue()}</td>;
