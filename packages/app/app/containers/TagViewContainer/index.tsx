import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { Track } from '@nuclear/ui/lib/types';

import * as SearchActions from '../../actions/search';
import * as TagActions from '../../actions/tag';
import * as QueueActions from '../../actions/queue';
import { RootState } from '../../reducers';
import TagView from '../../components/TagView';

const TagViewContainer: React.FC = () => {
  const history = useHistory();
  const { tagName } = useParams<{ tagName: string }>();
  const dispatch = useDispatch();
  
  const tags = useSelector((state: RootState) => state.tags);

  const handleLoadTagInfo = useCallback((tag: string) => {
    dispatch(TagActions.loadTagInfo(tag));
  }, [dispatch]);

  const handleArtistInfoSearch = useCallback((artistName: string) => {
    dispatch(SearchActions.artistInfoSearchByName(artistName, history));
  }, [dispatch, history]);

  const handleAlbumInfoSearch = useCallback((albumName: string) => {
    // TODO: Album search can be improved by adding artist name
    // TabTopList doesn't support artist name, but it can be added
    dispatch(SearchActions.albumInfoSearchByName(albumName, '', history));
  }, [dispatch, history]);

  const handleAddToQueue = useCallback((track: Track) => {
    dispatch(QueueActions.addToQueue(QueueActions.toQueueItem(track)));
  }, [dispatch]);

  return (
    <TagView
      loadTagInfo={handleLoadTagInfo}
      artistInfoSearchByName={handleArtistInfoSearch}
      albumInfoSearchByName={handleAlbumInfoSearch}
      history={history}
      tag={tagName}
      tags={tags}
      addToQueue={handleAddToQueue}
    />
  );
};

export default TagViewContainer;
