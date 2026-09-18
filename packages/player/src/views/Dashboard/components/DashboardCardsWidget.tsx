import isEmpty from 'lodash-es/isEmpty';
import { useMemo } from 'react';

import type { AttributedResult } from '@nuclearplayer/plugin-sdk';
import { CardsRow, CardsRowItem, CardsRowLabels } from '@nuclearplayer/ui';

type DashboardCardsWidgetProps<T> = {
  results: AttributedResult<T>[] | undefined;
  isLoading: boolean;
  title: string;
  labels: CardsRowLabels;
  mapItem: (item: T, result: AttributedResult<T>) => CardsRowItem;
  'data-testid'?: string;
};

export const DashboardCardsWidget = <T,>({
  results,
  isLoading,
  title,
  labels,
  mapItem,
  'data-testid': testId,
}: DashboardCardsWidgetProps<T>) => {
  if (isLoading) {
    return <CardsRow.Skeleton title={title} data-testid={testId} />;
  }

  if (isEmpty(results)) {
    return null;
  }

  return (
    <div data-testid={testId} className="flex flex-col gap-4">
      {results?.map((result) => (
        <DashboardCardsProviderRow
          key={result.providerId}
          result={result}
          title={title}
          labels={labels}
          mapItem={mapItem}
        />
      ))}
    </div>
  );
};

type DashboardCardsProviderRowProps<T> = {
  result: AttributedResult<T>;
  title: string;
  labels: CardsRowLabels;
  mapItem: (item: T, result: AttributedResult<T>) => CardsRowItem;
};

const DashboardCardsProviderRow = <T,>({
  result,
  title,
  labels,
  mapItem,
}: DashboardCardsProviderRowProps<T>) => {
  const items: CardsRowItem[] = useMemo(
    () => result.items.map((item) => mapItem(item, result)),
    [result, mapItem],
  );

  return (
    <CardsRow
      title={title}
      badge={result.providerName}
      items={items}
      labels={labels}
    />
  );
};
