import React from 'react';
import { get } from 'lodash';
import { Tab } from 'semantic-ui-react';

import { 
  SearchResultsAlbum, 
  SearchResultsArtist 
} from '@nuclear/core/src/plugins/plugins.types';
import { Card } from '@nuclear/ui';
import parentStyles from './styles.scss';

type ItemResultsProps<T extends SearchResultsAlbum | SearchResultsArtist> = {
  collection: T[];
  loading?: boolean;
  attached?: boolean;
  selectedProvider?: { searchName: string };
  onItemClick: (item: T) => void;
  emptyText: string;
};

const ItemResults = <T extends SearchResultsAlbum | SearchResultsArtist>({
  collection,
  loading = false,
  attached = false,
  selectedProvider,
  onItemClick,
  emptyText
}: ItemResultsProps<T>) => {
  const getItemHeader = (item: T): string => {
    return (item as SearchResultsAlbum).title || (item as SearchResultsArtist).name;
  };

  const getItemContent = (item: T): string | undefined => {
    if ('artist' in item) {
      return item.artist;
    }
    return undefined;
  };

  return (
    <Tab.Pane loading={loading} attached={attached}>
      <div className={parentStyles.pane_container}>
        {collection.length > 0
          ? loading
            ? null
            : collection.map((el, i) => {
              const id = get(el, `ids.${selectedProvider?.searchName}`, el.id);
              return (
                <Card
                  key={`title-card-${i}`}
                  header={getItemHeader(el)}
                  content={getItemContent(el)}
                  image={el.coverImage || el.thumb}
                  onClick={() => onItemClick(el)} 
                />
              );
            })
          : emptyText}
      </div>
    </Tab.Pane>
  );
};

export default ItemResults;
