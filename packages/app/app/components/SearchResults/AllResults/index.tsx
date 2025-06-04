import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
  SearchResultsAlbum,
  SearchResultsArtist
} from '@nuclear/core/src/plugins/plugins.types';
import { Card } from '@nuclear/ui';

import { TracksResults } from '../TracksResults';
import { searchSelectors } from '../../../selectors/search';
import { 
  artistInfoSearch as artistInfoSearchAction,
  albumInfoSearch as albumInfoSearchAction
} from '../../../actions/search';
import { SearchState } from '../../../reducers/search';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';
import styles from './styles.scss';


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
  return (
    <>
      {collection.slice(0, 5).map((item, index) => (
        <Card
          header={item.title || item.name}
          image={item.coverImage || item.thumb || item.thumbnail || artPlaceholder}
          content={item.artist}
          onClick={() => onClick({ id: item.id, item })}
          key={'item-' + index} />
      ))}
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
  const artistSearchResults = useSelector(searchSelectors.artistSearchResults);
  const albumSearchResults = useSelector(searchSelectors.albumSearchResults);
  const trackSearchResults = useSelector(searchSelectors.trackSearchResults);

  const tracksLength = trackSearchResults?.length || 0;
  const artistsLength = artistSearchResults?.length || 0;
  const albumsLength = albumSearchResults?.length || 0;

  const artistInfoSearch = useCallback(
    ({ id, item }: { id: string; item: SearchResultsArtist }) => {
      dispatch(artistInfoSearchAction(id, item));
    },
    [dispatch]
  );

  const albumInfoSearch = useCallback(
    ({ id, item }: { id: string; item: SearchResultsAlbum }) => {
      dispatch(albumInfoSearchAction(id, 'master', item));
    },
    [dispatch]
  );

  if (artistsLength + albumsLength === 0) {
    return <div>{t('empty')}</div>;
  }

  return (
    <div className={styles.all_results_container}>
      {artistsLength > 0 && (
        <ResultsSection
          title={t('artist', { count: artistSearchResults.length })}
          collection={artistSearchResults}
          onClick={artistInfoSearch}
        />
      )}
      {albumsLength > 0 && (
        <ResultsSection
          title={t('album', { count: albumSearchResults.length })}
          collection={albumSearchResults}
          onClick={albumInfoSearch}
        />
      )}
      {tracksLength > 0 && (
        <div className={styles.column}>
          <h3>{t('track_plural')}</h3>
          <div className={styles.row}>
            <TracksResults
              tracks={trackSearchResults}
              limit={5}
            />
          </div>
        </div>
      )}
    </div>
  );
};
