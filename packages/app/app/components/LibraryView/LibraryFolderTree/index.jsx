import PropTypes from 'prop-types';
import React, { useMemo, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import BaseTable, { AutoResizer } from 'react-base-table';
import _ from 'lodash';

import { ContextPopup, getThumbnail } from '@nuclear/ui';

import TrackPopupButtons from '../../../containers/TrackPopupButtons';
import { localLibraryActions } from '../../../actions/local';
import './styles.scss';

const useTreeData = (tracks, localFolders) => {
  return useMemo(() => {
    const pathToEntryMap = {};
    function getEntryForFolder(path) {
      if (pathToEntryMap[path] === undefined) {
        const newEntry = {
          id: path,
          path,
          name: path.split('/').slice(-1)[0],
          children: []
        };

        if (localFolders.includes(path)) {
          newEntry.parentId = -1;
        } else if (path.includes('/')) {
          const parentPath = path.split('/').slice(0, -1).join('/');
          const parent = getEntryForFolder(parentPath);
          newEntry.parentId = parent.id;
          parent.children.push(newEntry);
        } else {
          // We've reached a root directory/drive, meaning we couldn't find a local-folder containing this track.
          // This can happen if main storage (with local-folder list) is cleared, but not the separately-persisted tracks.
          // (Can also happen if the path-separators are not normalized consistently; check this if making code changes.)
          newEntry.parentId = -1;
        }

        pathToEntryMap[path] = newEntry;
      }
      return pathToEntryMap[path];
    }

    for (const track of tracks) {
      const folderPath = track.path.split('/').slice(0, -1).join('/');
      const folderEntry = getEntryForFolder(folderPath);
      const newEntry = {
        id: track.path,
        parentId: folderEntry.id,
        track,
        path: track.path,
        name: track.name,
        album: track.album,
        artist: _.isString(track.artist) ? track.artist : track.artist.name
      };
      pathToEntryMap[track.path] = newEntry;
      folderEntry.children.push(newEntry);
    }

    const rowEntries = Object.values(pathToEntryMap);
    const rootEntries = rowEntries.filter(entry => entry.parentId === -1);
    const idToEntryMap = {};
    for (const entry of rowEntries) {
      idToEntryMap[entry.id] = entry;
    }

    return {
      rootEntries,
      columns: [
        {
          title: 'Name',
          // width: width / 3,
          width: 0, // required, but flex-grow actually drives the sizing
          flexGrow: 2,
          key: 'name',
          dataKey: 'name'
        },
        {
          title: 'Album',
          width: 0,
          flexGrow: 1,
          key: 'album',
          dataKey: 'album'
        },
        {
          title: 'Artist',
          width: 0,
          flexGrow: 1,
          key: 'artist',
          dataKey: 'artist'
        }
      ]
    };
  }, [localFolders, tracks]);
};

const LibraryFolderTree = ({
  tracks,
  localFolders,
  expandedFolders
}) => {
  const { rootEntries, columns } = useTreeData(tracks, localFolders);

  const tableRef = useRef();
  const dispatch = useDispatch();
  const dispatchUpdateExpandedFolders = () => {
    if (tableRef.current) {
      dispatch(localLibraryActions.updateExpandedFolders(tableRef.current.getExpandedRowKeys()));
    }
  };
  useEffect(() => {
    return dispatchUpdateExpandedFolders;
  });

  return (
    <AutoResizer>
      {({ width, height }) => (
        <BaseTable
          ref={tableRef}
          columns={columns}
          data={rootEntries}
          rowHeight={23}
          expandColumnKey='name'
          defaultExpandedRowKeys={expandedFolders}
          onExpandedRowsChange={_.debounce(dispatchUpdateExpandedFolders, 1000)}
          width={width}
          height={height}
          rowRenderer={rowProps => {
            const { cells, rowData: entry } = rowProps;
            const key = 'library-track-' + tracks.indexOf(entry.track);
            if (entry.track) {
              return (
                <ContextPopup
                  key={key}
                  trigger={<div style={{ flex: 1, display: 'flex' }}>{cells}</div>}
                  thumb={getThumbnail(entry.track)}
                  title={_.get(entry.track, ['name'])}
                  artist={_.get(entry.track, ['artist', 'name'])}
                >
                  <TrackPopupButtons track={entry.track} withAddToDownloads={false} />
                </ContextPopup>
              );
            }
            return (
              <React.Fragment key={key}>
                {cells}
              </React.Fragment>
            );
          }} />
      )}
    </AutoResizer>
  );
};

LibraryFolderTree.propTypes = {
  tracks: PropTypes.array,
  localFolders: PropTypes.arrayOf(PropTypes.string),
  expandedFolders: PropTypes.arrayOf(PropTypes.string)
};

export default LibraryFolderTree;
