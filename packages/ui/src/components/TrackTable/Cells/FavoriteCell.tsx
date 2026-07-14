import { CellContext } from '@tanstack/react-table';

import { Track } from '@nuclearplayer/model';

import { FavoriteButton } from '../../FavoriteButton';
import { useTrackTableContext } from '../TrackTableContext';

type FavoriteCellMeta = {
  onToggleFavorite: (track: Track) => void;
  isTrackFavorite: (track: Track) => boolean;
};

export const FavoriteCell = <T extends Track>({
  row,
  table,
}: CellContext<T, unknown>) => {
  const meta = table.options.meta as FavoriteCellMeta;
  const { labels } = useTrackTableContext<T>();
  const track = row.original;

  const isFavorite = meta.isTrackFavorite(track);

  return (
    <td className="w-10 text-center">
      <FavoriteButton
        size="sm"
        isFavorite={isFavorite}
        onToggle={() => meta.onToggleFavorite(track)}
        ariaLabelAdd={labels.favorite}
        ariaLabelRemove={labels.unfavorite}
      />
    </td>
  );
};
