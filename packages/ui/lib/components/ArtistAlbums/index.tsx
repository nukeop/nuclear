import { SearchResultsAlbum } from '@nuclear/core/src/plugins/plugins.types';
import React, { useMemo, useState } from 'react';
import { AlbumGrid, Button, Dropdown, FormInput } from '../..';
import styles from './styles.scss';

export type ArtistAlbumsStrings = {
  header: string;
  sortByReleaseDate: string;
  sortByAZ: string;
  sortByMostPlayed: string;
  filterPlaceholder: string;
}

export type ArtistAlbumsProps = {
    albums: SearchResultsAlbum[];
    onAlbumClick?: (album: SearchResultsAlbum) => void;
    isLoading?: boolean;
    strings: ArtistAlbumsStrings;
    withSortByReleaseDate?: boolean;
    withSortByAZ?: boolean;
    withSortByMostPlayed?: boolean;
}

type SortBy = 'release_date' | 'A-Z' | 'most_played';

export const ArtistAlbums: React.FC<ArtistAlbumsProps> = ({
  albums,
  onAlbumClick,
  isLoading,
  strings,
  withSortByAZ,
  withSortByMostPlayed,
  withSortByReleaseDate
}) => {
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('release_date');

  const sortOptions = useMemo(() => {
    const options = [];

    if (withSortByReleaseDate) {
      options.push({
        key: 'release_date',
        text: strings.sortByReleaseDate,
        value: 'release_date'
      });
    }

    if (withSortByAZ) {
      options.push({
        key: 'A-Z',
        text: strings.sortByAZ,
        value: 'A-Z'
      });
    }

    if (withSortByMostPlayed) {
      options.push({
        key: 'most_played',
        text: strings.sortByMostPlayed,
        value: 'most_played'
      });
    }

    return options;
  }, [withSortByAZ, withSortByMostPlayed, withSortByReleaseDate]);

  const filteredAlbums = useMemo(() => {
    return albums.filter(album => album.title.toLowerCase().includes(filter.toLowerCase()));
  }, [albums, filter]);

  const sortedAlbums = useMemo(() => {
    if (sortBy === 'release_date') {
      return filteredAlbums.sort((a, b) => a.year?.localeCompare(b.year));
    }

    if (sortBy === 'A-Z') {
      return filteredAlbums.sort((a, b) => a.title?.localeCompare(b.title));
    }

    return filteredAlbums;
  }, [filteredAlbums, sortBy]);

  return (
    <div className={styles.artist_albums}>
      {
        !isLoading &&
        <div className={styles.artist_albums_toolbar}>
          <h3>{strings.header}</h3>
          <hr />
          <Dropdown
            className={styles.artist_albums_sort_dropdown} 
            selection
            variant='lighter'
            options={sortOptions}
            value={sortBy}
            onChange={(e, { value }) => setSortBy(value as SortBy)}
          />
          <div className={styles.artist_albums_filter}>
            <FormInput
              className={styles.artist_albums_filter_input} 
              placeholder={strings.filterPlaceholder}
              onChange={setFilter}
            />
            <Button 
              className={styles.artist_albums_filter_button}
              color='blue'
              icon='filter'
            />
          </div>
        </div>
      }

      <AlbumGrid
        albums={sortedAlbums}
        onAlbumClick={onAlbumClick} 
        autoSize
        loading={isLoading}
      />
    </div>
  );
};
