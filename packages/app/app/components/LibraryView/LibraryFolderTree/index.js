import React, {useMemo} from 'react';
import {compose} from 'recompose';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import { ContextPopup, getThumbnail } from '@nuclear/ui';
import TrackPopupButtons from '../../../containers/TrackPopupButtons';
import './styles.scss';
import BaseTable, { AutoResizer } from 'react-base-table';
// import 'react-base-table/styles.css';

const useTreeData = (tracks, localFolders, width) => {
  return useMemo(() => {
    // console.log('Recalculating treeConfig.');

    const pathToEntryMap = {};
    let lastID = 0;
    function getEntryForFolder(path) {
      if (pathToEntryMap[path] === undefined) {
        const newEntry = {
          id: ++lastID,
          path,
          name: path.split('/').slice(-1)[0],
          children: []
          // _hideChildren: true
        };
  
        if (localFolders.includes(path)) {
          newEntry.parentId = -1;
        } else {
          const parentPath = path.split('/').slice(0, -1).join('/');
          if (parentPath.length === 0) {
            throw new Error('Parent path cannot be empty. (the folder/file path-separators must not be normalized)');
          }
          const parent = getEntryForFolder(parentPath);
          newEntry.parentId = parent.id;
          parent.children.push(newEntry);
        }
  
        pathToEntryMap[path] = newEntry;
      }
      return pathToEntryMap[path];
    }
  
    for (const track of tracks) {
      const folderPath = track.path.split('/').slice(0, -1).join('/');
      const folderEntry = getEntryForFolder(folderPath);
      const newEntry = {
        id: ++lastID,
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
          // width: '30%',
          width: width / 3,
          className: 'additional-class',
          key: 'name',
          dataKey: 'name',
          sortable: false,
          expandable: true
        },
        {
          title: 'Album',
          width: width / 3,
          key: 'album',
          dataKey: 'album',
          sortable: false,
          className: 'additional-class',
          defaultSortDirection: 'descend'
        },
        {
          title: 'Artist',
          width: width / 3,
          key: 'artist',
          dataKey: 'artist',
          sortable: false,
          className: 'additional-class'
        }
      ]
    };
  }, [width, localFolders, tracks]);
};

const LibraryFolderTree = ({
  tracks,
  localFolders
  /* sortBy,
  direction,
  handleSort,
  // estimateItemSize,
  t*/
}) => {
  return (
    <AutoResizer>
      {({ width, height }) => {
        return <LibraryFolderTreeWithSize {...{tracks, localFolders, width, height}}/>;
      }}
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

const LibraryFolderTreeWithSize = ({tracks, localFolders, width, height}) => {
  const {rootEntries, columns} = useTreeData(tracks, localFolders, width);
  return (
    <BaseTable
      columns={columns} data={rootEntries}
      rowHeight={20}
      expandColumnKey='name'
      width={width} height={height}
      rowRenderer_={rowProps => {
        const {cells, rowData: entry} = rowProps;
        // debugger;

        const rowUI = (
          <tr {...rowProps}>
            {cells}
          </tr>
        );
        if (entry.track) {
          return (
            <ContextPopup
              trigger={rowUI}
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
  );
};
