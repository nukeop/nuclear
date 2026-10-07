import type { LegacyRow } from '@tanstack/react-table/legacy';
import type { VirtualItem } from '@tanstack/react-virtual';
import { memo } from 'react';

import { Track } from '@nuclearplayer/model';

type Props<T extends Track> = {
  rows: LegacyRow<T>[];
  virtualItems: VirtualItem[];
  paddingTop: number;
  paddingBottom: number;
  colSpan: number;
  rowHeight: number;
  renderRow: (args: {
    row: LegacyRow<T>;
    virtual: VirtualItem;
  }) => React.ReactNode;
};

function Component<T extends Track>(props: Props<T>) {
  const { rows, virtualItems, paddingTop, paddingBottom, colSpan, renderRow } =
    props;

  return (
    <tbody>
      {paddingTop > 0 && (
        <tr style={{ height: paddingTop }} className="border-none">
          <td colSpan={colSpan} />
        </tr>
      )}
      {virtualItems.map((virtualRow) => {
        const row = rows[virtualRow.index];
        return renderRow({ row, virtual: virtualRow });
      })}
      {paddingBottom > 0 && (
        <tr style={{ height: paddingBottom }} className="border-none">
          <td colSpan={colSpan} />
        </tr>
      )}
    </tbody>
  );
}

export const VirtualizedBody = memo(Component) as typeof Component;
