import React, {useMemo} from 'react';
import {Grid } from 'react-redux-grid';
import {compose} from 'recompose';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import { ContextPopup, getThumbnail } from '@nuclear/ui';
import TrackPopupButtons from '../../../containers/TrackPopupButtons';
import './styles.scss';

// const GridPure = React.memo(Grid);
// let lastState = {};

// create separate store, for max performance (there was slowdown in main store)
// const storeForGrid = createStore(combineReducers(gridReducers), {});

const LibraryFolderTree = ({
  tracks,
  localFolders
  /* sortBy,
  direction,
  handleSort,
  // estimateItemSize,
  t*/
}) => {
  const storeForGrid = useMemo(() => {
    const getState = () => window.store.getState().reactReduxGrid;
    return {
      getState,
      subscribe: window.store.subscribe,
      /* subscribe: listener => {
        return window.store.subscribe(() => {
          const newState = getState();
          if (newState === lastState) {
            return;
          }
          lastState = newState;
          listener();
        });
      },*/
      dispatch: window.store.dispatch
    };
  }, []);

  const treeConfig = useMemo(() => {
    // console.log('Recalculating treeConfig.');

    const pathToEntryMap = {};
    let lastID = 0;
    function getEntryForFolder(path) {
      if (pathToEntryMap[path] === undefined) {
        const newEntry = {
          id: ++lastID,
          path,
          name: path.split('/').slice(-1)[0],
          children: [],
          _hideChildren: true
        };
  
        if (localFolders.includes(path)) {
          newEntry.parentId = -1;
        } else {
          const parentPath = path.split('/').slice(0, -1).join('/');
          if (parentPath.length === 0) {
            throw new Error('Parent path cannot be empty; the folder/file path-separators must not be normalized.');
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
    const idToEntryMap = {};
    for (const entry of Object.values(pathToEntryMap)) {
      idToEntryMap[entry.id] = entry;
    }
  
    const data = {
      root: {
        id: -1,
        name: 'Root',
        children: Object.values(pathToEntryMap).filter(entry => localFolders.includes(entry.path))
      }
    };
  
    return {
      store: storeForGrid,
      stateKey: 'local-library-folder-tree',
      gridType: 'tree', // either `tree` or `grid`,
      showTreeRootNode: false, // dont display root node of tree
      // pageSize: Object.values(pathToEntryMap).length,
      infinite: true,
  
      plugins: {
        COLUMN_MANAGER: {
          resizable: true,
          moveable: true
          /* sortable: {
            enabled: true,
            method: 'local',
            sortingSource: pagingDataSource
          }*/
        },
        EDITOR: {
          type: 'inline',
          enabled: true
        },
        PAGER: {
          enabled: false
        },
        LOADER: {
          enabled: true
        },
        SELECTION_MODEL: {
          mode: 'single'
        },
        ERROR_HANDLER: {
          defaultErrorMessage: 'AN ERROR OCURRED',
          enabled: true
        },
        GRID_ACTIONS: null,
        BULK_ACTIONS: {
          enabled: false
        },
        ROW: {
          enabled: true,
          renderer: ({rowProps, cells}) => {
            // const entry = getEntryByID(cells[0].props.treeData.id);
            const entry = idToEntryMap[cells[0].props.treeData.id];
            // can be undefined when navigating back to panel
            if (entry === undefined) {
              return null;
            }
  
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
          }
        }
      },
      columns: [
        {
          name: 'Name',
          width: '30%',
          className: 'additional-class',
          dataIndex: 'name',
          sortable: false,
          expandable: true
        },
        {
          name: 'Album',
          dataIndex: 'album',
          sortable: false,
          className: 'additional-class',
          defaultSortDirection: 'descend'
        },
        {
          name: 'Artist',
          dataIndex: 'artist',
          sortable: false,
          className: 'additional-class'
        }
      ],
      data
    };
  }, [storeForGrid, tracks, localFolders]);
  
  return <Grid {...treeConfig}/>;
  /* return <GridPure {...treeConfig}
    // since we artificially made the component pure, we have to also...
    // gridStoreState={storeForGrid.getState()}
  />;*/
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
