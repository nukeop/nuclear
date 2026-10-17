import type { CellContext } from '@tanstack/react-table';
import type { LegacyFeatures } from '@tanstack/react-table/legacy';

import { Artwork, Track } from '@nuclearplayer/model';

export const ThumbnailCell = <T extends Track>(
  context: CellContext<LegacyFeatures, T, Artwork>,
) => {
  return (
    <td className="w-10 text-center">
      <div className="flex w-full justify-center">
        <img
          className="w-10 min-w-10"
          src={context.getValue()?.url}
          loading="lazy"
          decoding="async"
        />
      </div>
    </td>
  );
};
