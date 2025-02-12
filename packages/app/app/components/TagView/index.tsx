import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { History } from 'history';
import { LastfmArtistShort, LastfmTag, LastfmAlbum, LastfmTrackMatch, LastfmTagTopTrack } from '@nuclear/core/src/rest/Lastfm.types';

import TagDescription from './TagDescription';
import TagHeader from './TagHeader';
import TagTopList from './TagTopList';
import TagTopTracks from './TagTopTracks';
import styles from './styles.scss';

type TagViewProps = WithTranslation & {
  loadTagInfo: (tag: string) => void;
  artistInfoSearchByName: (artistName: string, history: History) => void;
  albumInfoSearchByName: (albumName: string, history: History) => void;
  addToQueue: (track: { artist: string; name: string; thumbnail: string }) => void;
  history: History;
  tag: string;
  tags: {
    [key: string]: {
      loading?: boolean;
      // API response array containing [tagInfo, topTracks, topAlbums, topArtists]
      0?: LastfmTag;
      1?: LastfmTagTopTrack[];
      2?: LastfmAlbum[];
      3?: LastfmArtistShort[];
    };
  };
}

const TagView: React.FC<TagViewProps> = ({
  loadTagInfo,
  artistInfoSearchByName,
  albumInfoSearchByName,
  addToQueue,
  history,
  tag,
  tags,
  t
}) => {
  React.useEffect(() => {
    loadTagInfo(tag);
  }, [loadTagInfo, tag]);

  const handleArtistClick = React.useCallback((artistName: string) => {
    artistInfoSearchByName(artistName, history);
  }, [artistInfoSearchByName, history]);

  const handleAlbumClick = React.useCallback((albumName: string) => {
    albumInfoSearchByName(albumName, history);
  }, [albumInfoSearchByName, history]);

  const renderTagHeader = (tagInfo?: LastfmTag, topArtists?: LastfmArtistShort[]) => (
    <TagHeader tag={tag} topArtists={topArtists ?? []} />
  );

  const renderTopArtists = (topArtists?: LastfmArtistShort[]) => (
    <TagTopList
      topList={topArtists ?? []}
      onClick={handleArtistClick}
      header={t('artists')}
    />
  );

  const renderTopAlbums = (topAlbums?: LastfmAlbum[]) => (
    <TagTopList
      topList={topAlbums ?? []}
      onClick={handleAlbumClick}
      header={t('albums')}
    />
  );

  const renderTagTopTracks = (topTracks: LastfmTagTopTrack[], addToQueue: TagViewProps['addToQueue']) => (
    <TagTopTracks
      tracks={topTracks ?? []}
      addToQueue={addToQueue}
    />
  );

  const renderTopArtistsAndTopAlbums = (topArtists?: LastfmArtistShort[], topAlbums?: LastfmAlbum[]) => (
    <div className={styles.lists_container}>
      {renderTopArtists(topArtists)}
      {renderTopAlbums(topAlbums)}
    </div>
  );

  const renderDimmer = () => (
    <Dimmer active={typeof tags[tag] === 'undefined' || tags[tag]?.loading}>
      <Loader />
    </Dimmer>
  );

  const tagInfo = tags[tag]?.[0];
  const topTracks = tags[tag]?.[1] ?? [];
  const topAlbums = tags[tag]?.[2] ?? [];
  const topArtists = tags[tag]?.[3] ?? [];
  const isLoading = typeof tags[tag] === 'undefined' || tags[tag]?.loading;

  return (
    <div className={styles.tag_view_container}>
      <Dimmer.Dimmable>
        {renderDimmer()}
        {!isLoading && (
          <div>
            {renderTagHeader(tagInfo, topArtists)}
            <TagDescription tagInfo={tagInfo!} />
            {renderTopArtistsAndTopAlbums(topArtists, topAlbums)}
            {renderTagTopTracks(topTracks, addToQueue)}
          </div>
        )}
      </Dimmer.Dimmable>
    </div>
  );
};

export default withTranslation('tags')(TagView);
