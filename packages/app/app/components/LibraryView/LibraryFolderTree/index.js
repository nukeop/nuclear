import React, {useMemo, useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {compose} from 'recompose';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import { ContextPopup, getThumbnail } from '@nuclear/ui';
import TrackPopupButtons from '../../../containers/TrackPopupButtons';
import './styles.scss';
import BaseTable, { AutoResizer } from 'react-base-table';
import {updateExpandedFolders} from '../../../actions/local';
// import 'react-base-table/styles.css';

//  const useTreeData = (tracks, localFolders, width) => {
const useTreeData = (tracks, localFolders) => {
  return useMemo(() => {
    // console.log('Recalculating treeConfig.');

    const pathToEntryMap = {};
    // let lastID = 0;
    function getEntryForFolder(path) {
      if (pathToEntryMap[path] === undefined) {
        const newEntry = {
          // id: ++lastID,
          id: path,
          path,
          name: path.split('/').slice(-1)[0],
          children: []
          // _hideChildren: true
        };
  
        if (localFolders.includes(path)) {
          newEntry.parentId = -1;
        } else if (path.includes('/')) {
          /* if (!localFolders.find(folderPath => path.startsWith(folderPath))) {
            throw new Error(`Track at path "${path}" is not contained in any of the root library folders! (ensure path-separators match)`);
          }*/

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
        // id: ++lastID,
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

    /* function getEntryByID(id) {
      return Object.values(pathToEntryMap).find(entry => entry.id === id);
    }*/
    const rowEntries = Object.values(pathToEntryMap);
    const rootEntries = rowEntries.filter(entry => entry.parentId === -1);
    const idToEntryMap = {};
    for (const entry of rowEntries) {
      idToEntryMap[entry.id] = entry;
    }
  
    return {
      // idToEntryMap,
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
  const {rootEntries, columns} = useTreeData(tracks, localFolders);

  const tableRef = useRef();
  const dispatch = useDispatch();
  const dispatchUpdateExpandedFolders = () => {
    if (tableRef.current) {
      dispatch(updateExpandedFolders(tableRef.current.getExpandedRowKeys()));
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
          columns={columns} data={rootEntries}
          rowHeight={23}
          expandColumnKey='name'
          defaultExpandedRowKeys={expandedFolders}
          onExpandedRowsChange={_.debounce(dispatchUpdateExpandedFolders, 1000)}
          width={width}
          height={height}
          rowRenderer={rowProps => {
            const {cells, rowData: entry} = rowProps;
            const rowUI = <>
              {cells}
            </>;
            if (entry.track) {
              return (
                <ContextPopup
                  // trigger={rowUI}
                  trigger={<div style={{flex: 1, display: 'flex'}}>{cells}</div>}
                  key={'library-track-' + tracks.indexOf(entry.track)}
                  thumb={getThumbnail(entry.track)}
                  title={_.get(entry.track, ['name'])}
                  artist={_.get(entry.track, ['artist', 'name'])}
                >
                  <TrackPopupButtons track={entry.track} withAddToDownloads={false}/>
                </ContextPopup>
              );
            }
            return rowUI;
          }}>
          {/* <Column key='name' dataKey='name' width={width / 3}/>
          <Column key='album' dataKey='album' width={width / 3}/>
          <Column key='artist' dataKey='artist' width={width / 3}/> */}
        </BaseTable>
      )}
    </AutoResizer>
  );
};

LibraryFolderTree.propTypes = {
  tracks: PropTypes.array,
  localFolders: PropTypes.arrayOf(PropTypes.string),
  sortBy: PropTypes.string,
  direction: PropTypes.string,
  handleSort: PropTypes.func
};

export default compose(
  withTranslation('library')
)(LibraryFolderTree);
