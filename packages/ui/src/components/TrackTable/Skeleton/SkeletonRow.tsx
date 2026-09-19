import { FC } from 'react';

import { TrackTableSkeletonColumnKind } from '../types';
import { DEFAULT_ROW_HEIGHT } from '../utils/constants';
import { SkeletonColumn } from './skeletonColumns';
import { SkeletonIconCell } from './SkeletonIconCell';
import { SkeletonTextCell } from './SkeletonTextCell';
import { SkeletonThumbnailCell } from './SkeletonThumbnailCell';

type SkeletonCellProps = {
  rowIndex: number;
};

const cellByKind: Record<
  TrackTableSkeletonColumnKind,
  FC<SkeletonCellProps>
> = {
  icon: SkeletonIconCell,
  thumbnail: SkeletonThumbnailCell,
  text: SkeletonTextCell,
};

type SkeletonRowProps = {
  columns: SkeletonColumn[];
  rowIndex: number;
};

export const SkeletonRow: FC<SkeletonRowProps> = ({ columns, rowIndex }) => (
  <tr
    data-testid="track-row-skeleton"
    style={{ height: DEFAULT_ROW_HEIGHT }}
    className="border-border bg-muted border-b-(length:--border-width)"
  >
    {columns.map((column) => {
      const Cell = cellByKind[column.kind];
      return <Cell key={column.id} rowIndex={rowIndex} />;
    })}
  </tr>
);
