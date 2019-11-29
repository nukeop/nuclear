import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { withHandlers } from 'recompose';

import styles from './styles.scss';

export const LIST_TYPE = Object.freeze({
  SIMPLE_LIST: 'simple-list',
  ALBUM_GRID: 'album-grid',
  ALBUM_LIST: 'album-list'
});

const LibraryListTypeToggle = ({
  toggleSimpleList,
  toggleAlbumGrid,
  toggleAlbumList,
  listType
}) => (
  <Button.Group className={styles.library_list_type_toggle}>
    {
    // TODO: To be developed and re-enabled later
    // <Button
    //   inverted icon='bars' onClick={toggleAlbumList}
    //   active={listType === LIST_TYPE.ALBUM_LIST}
    //
    // />
    }
    <Button
      inverted icon='th' onClick={toggleAlbumGrid}
      active={listType === LIST_TYPE.ALBUM_GRID}
    />
    <Button
      inverted icon='table' onClick={toggleSimpleList}
      active={listType === LIST_TYPE.SIMPLE_LIST}
    />
  </Button.Group>
);


LibraryListTypeToggle.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleListType: PropTypes.func,
  listType: PropTypes.string
};

export default withHandlers({
  toggleSimpleList: ({toggleListType}) => () => toggleListType(LIST_TYPE.SIMPLE_LIST),
  toggleAlbumGrid: ({toggleListType}) => () => toggleListType(LIST_TYPE.ALBUM_GRID),
  toggleAlbumList: ({toggleListType}) => () => toggleListType(LIST_TYPE.ALBUM_LIST)
})(LibraryListTypeToggle);
