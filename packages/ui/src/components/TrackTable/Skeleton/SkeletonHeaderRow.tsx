import { FC } from 'react';

import { TrackTableSkeletonColumnKind } from '../types';
import { SkeletonColumn } from './skeletonColumns';
import { SkeletonIconHeader } from './SkeletonIconHeader';
import { SkeletonTextHeader } from './SkeletonTextHeader';

const headerByKind: Record<TrackTableSkeletonColumnKind, FC> = {
  icon: SkeletonIconHeader,
  thumbnail: SkeletonIconHeader,
  text: SkeletonTextHeader,
};

type SkeletonHeaderRowProps = {
  columns: SkeletonColumn[];
};

export const SkeletonHeaderRow: FC<SkeletonHeaderRowProps> = ({ columns }) => (
  <tr className="border-border surface-primary border-b-(length:--border-width)">
    {columns.map((column) => {
      const Header = headerByKind[column.kind];
      return <Header key={column.id} />;
    })}
  </tr>
);
