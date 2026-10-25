import type { CellContext } from '@tanstack/react-table';
import type { LegacyFeatures } from '@tanstack/react-table/legacy';

import { Track } from '@nuclearplayer/model';

export const TextCell = <T extends Track>(
  context: CellContext<LegacyFeatures, T, string | number | undefined>,
) => (
  <td className="cursor-default truncate px-2">
    <div className="truncate">{context.getValue()}</div>
  </td>
);
