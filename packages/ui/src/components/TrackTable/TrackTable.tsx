import type { DragEndEvent } from '@dnd-kit/core';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useRef } from 'react';

import { Track } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { defaultDisplay, defaultFeatures } from './defaults';
import { FilterBar } from './FilterBar';
import { useColumns } from './hooks/useColumns';
import { useGlobalFilter } from './hooks/useGlobalFilter';
import { useReorder } from './hooks/useReorder';
import { useSorting } from './hooks/useSorting';
import { useVirtualRows } from './hooks/useVirtualRows';
import { mergeLabels } from './labels';
import { ReorderLayer } from './ReorderLayer';
import { SortableRow } from './SortableRow';
import { TrackTableProvider } from './TrackTableContext';
import { TrackTableProps } from './types';
import { DEFAULT_OVERSCAN, DEFAULT_ROW_HEIGHT } from './utils/constants';
import { VirtualizedBody } from './VirtualizedBody';

const defaultGetItemId = <T extends Track>(track: T) => track.source.id;

export function TrackTable<T extends Track = Track>({
  tracks,
  getItemId = defaultGetItemId,
  labels,
  classes,
  display,
  features,
  actions,
  meta,
  rowHeight = DEFAULT_ROW_HEIGHT,
  overscan = DEFAULT_OVERSCAN,
}: TrackTableProps<T>) {
  const resolvedFeatures = {
    ...defaultFeatures,
    ...features,
  };

  const resolvedDisplay = {
    ...defaultDisplay,
    ...display,
  };

  const { sorting, setSorting, isSorted } = useSorting();
  const itemIds = useMemo(
    () => tracks.map((t, i) => getItemId(t, i)),
    [tracks, getItemId],
  );
  const { onDragStart, onDragEnd } = useReorder({
    itemIds,
    onReorder: actions?.onReorder,
  });
  const { globalFilter, setGlobalFilter, globalFilterFn, hasFilter } =
    useGlobalFilter<T>();

  const mergedLabels = mergeLabels(labels);

  const columns: ColumnDef<T>[] = useColumns<T>({
    display: resolvedDisplay,
    labels,
    actions,
  });

  const table = useReactTable({
    columns,
    data: tracks,
    state: { sorting, globalFilter },
    enableSortingRemoval: true,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      displayQueueControls: resolvedDisplay.displayQueueControls,
      onAddToQueue: actions?.onAddToQueue,
      onToggleFavorite: actions?.onToggleFavorite,
      onRemove: actions?.onRemove,
      isTrackFavorite: meta?.isTrackFavorite,
      ContextMenuWrapper: meta?.ContextMenuWrapper,
      favoriteLabel: mergedLabels.favorite,
      unfavoriteLabel: mergedLabels.unfavorite,
    },
  });

  const { rows } = table.getRowModel();
  const colCount = table.getVisibleFlatColumns().length;

  const scrollParentRef = useRef<HTMLDivElement | null>(null);
  const { virtualItems, paddingTop, paddingBottom } = useVirtualRows({
    count: rows.length,
    rowHeight,
    overscan,
    scrollParentRef,
  });

  const isReorderable = Boolean(
    resolvedFeatures?.reorderable && !isSorted && !hasFilter,
  );

  const dndItems = rows.map((row) => getItemId(row.original, row.index));

  const mockViewportHeight = rowHeight * 12;

  return (
    <TrackTableProvider value={{ isReorderable }}>
      {resolvedFeatures?.filterable && (
        <FilterBar
          value={globalFilter}
          onChange={setGlobalFilter}
          className="m-2"
          placeholder="Filter tracks"
        />
      )}
      <div
        ref={scrollParentRef}
        className="relative flex max-h-full w-full overflow-y-auto"
        data-test-resize-observer-inline-size="1024"
        data-test-resize-observer-block-size={String(mockViewportHeight)}
      >
        <ReorderLayer
          enabled={isReorderable}
          items={dndItems}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd as (evt: DragEndEvent) => void}
        >
          <table
            role="table"
            className={cn(
              'border-border relative w-full border-2',
              classes?.root,
            )}
          >
            {resolvedFeatures?.header && (
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    role="row"
                    className="border-border bg-primary border-b-2"
                  >
                    {headerGroup.headers.map((header) =>
                      flexRender(header.column.columnDef.header, {
                        ...header.getContext(),
                        key: header.id,
                      }),
                    )}
                  </tr>
                ))}
              </thead>
            )}
            <VirtualizedBody
              rows={rows}
              virtualItems={virtualItems}
              paddingTop={paddingTop}
              paddingBottom={paddingBottom}
              colSpan={colCount}
              rowHeight={rowHeight}
              renderRow={({ row, virtual }) => (
                <SortableRow
                  key={getItemId(row.original, row.index)}
                  row={row}
                  itemId={getItemId(row.original, row.index)}
                  style={{ height: rowHeight }}
                  isReorderable={isReorderable}
                  data-index={virtual.index}
                />
              )}
            />
          </table>
        </ReorderLayer>
      </div>
    </TrackTableProvider>
  );
}
