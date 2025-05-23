import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Card } from '@nuclear/ui';

import { searchSelectors } from '../../../selectors/search';
import { artistInfoSearch as artistInfoSearchAction } from '../../../actions/search';
import { SearchState } from '../../../reducers/search';
import { pluginsSelectors } from '../../../selectors/plugins';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';
import styles from './styles.scss';
import {
  SearchResultsAlbum,
  SearchResultsArtist
} from '@nuclear/core/src/plugins/plugins.types';

type SearchCollection = SearchState[
  | 'artistSearchResults'
  | 'albumSearchResults'];

type ResultsProps = {
  collection: SearchCollection;
  onClick: ({
    id,
    item
  }: {
    id: string;
    item: SearchResultsArtist | SearchResultsAlbum;
  }) => void;
};
const Results: FC<ResultsProps> = ({ collection, onClick }) => {
  const metaProviders = useSelector(pluginsSelectors.plugins).metaProviders;
  const selectedProviderName = useSelector(
    pluginsSelectors.selected
  ).metaProviders;
  const selectedProvider = useMemo(
    () =>
      metaProviders.find(
        (metaProvider) => metaProvider.sourceName === selectedProviderName
      ),
    [metaProviders, selectedProviderName]
  );

  return (
    <>
      {collection.slice(0, 5).map((item, index) => {
        return (
          <Card
            header={item.title || item.name}
            image={
              item.coverImage || item.thumb || item.thumbnail || artPlaceholder
            }
            content={item.artist}
            onClick={() => onClick({ id: item.id, item })}
            key={'item-' + index}
          />
        );
      })}
    </>
  );
};

type ResultsSectionProps = {
  title: string;
  collection: SearchCollection;
  onClick: ({
    id,
    item
  }: {
    id: string;
    item: SearchResultsArtist | SearchResultsAlbum;
  }) => void;
};
const ResultsSection: FC<ResultsSectionProps> = ({
  title,
  collection,
  onClick
}) => {
  return (
    <div className={styles.column}>
      <h3>{title}</h3>
      <div className={styles.row}>
        <Results collection={collection} onClick={onClick} />
      </div>
    </div>
  );
};

type AllResultsProps = {};

export const AllResults: FC<AllResultsProps> = () => {
  const { t } = useTranslation('search');
  const dispatch = useDispatch();
  const trackSearchResults = useSelector(searchSelectors.trackSearchResults);
  const artistSearchResults = useSelector(searchSelectors.artistSearchResults);
  const albumSearchResults = useSelector(searchSelectors.albumSearchResults);

  const artistsLength = artistSearchResults?.length;
  const artistInfoSearch = useCallback(
    ({ id, item }: { id: string; item: SearchResultsArtist }) => {
      dispatch(artistInfoSearchAction(id, item));
    },
    []
  );

  return (
    <div className={styles.all_results_container}>
      {artistsLength > 0 && (
        <ResultsSection
          title={t('artist', { count: artistSearchResults.length })}
          collection={artistSearchResults}
          onClick={artistInfoSearch}
        />
      )}
    </div>
  );
};
