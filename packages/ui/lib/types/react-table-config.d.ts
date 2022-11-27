// This is to expand the default types with all of the plugin extensions
// More info here: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-table
import { UseRowSelectOptions, UseRowStateOptions, UseSortByOptions } from 'react-table';

declare module 'react-table' {
  export interface TableOptions<D extends Record<string, unknown>>
    extends UseRowSelectOptions<D>,
      UseRowStateOptions<D>,
      UseSortByOptions<D> {}

  export interface Hooks<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseExpandedHooks<D>,
      UseGroupByHooks<D>,
      UseRowSelectHooks<D>,
      UseSortByHooks<D> {}

  export interface TableInstance<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseGroupByInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseRowStateInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  export interface TableState<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseGroupByState<D>,
      UseRowSelectState<D>,
      UseRowStateState<D>,
      UseSortByState<D> {}

  export interface ColumnInterface<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseGroupByColumnOptions<D>,
      UseSortByColumnOptions<D> {}

  export interface ColumnInstance<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseGroupByColumnProps<D>,
      UseSortByColumnProps<D> {}

  export interface Cell<D extends Record<string, unknown> = Record<string, unknown>, V = any>
    extends UseGroupByCellProps<D>,
      UseRowStateCellProps<D> {}

  export interface Row<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseGroupByRowProps<D>,
      UseRowSelectRowProps<D>,
      UseRowStateRowProps<D> {}
}
