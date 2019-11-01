import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { withHandlers } from 'recompose';

import styles from './styles.scss';

const LibraryListTypeToggle = ({
  toggleSimpleList,
  toggleAlbumGrid,
  toggleAlbumList
}) => (
  <Button.Group className={styles.library_list_type_toggle}>
    <Button inverted icon='bars' onClick={toggleAlbumList} />
    <Button inverted icon='th' onClick={toggleAlbumGrid} />
    <Button inverted icon='table' onClick={toggleSimpleList} />
  </Button.Group>
);


LibraryListTypeToggle.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleListType: PropTypes.func
};

export default withHandlers({
  toggleSimpleList: ({toggleListType}) => () => toggleListType('simple-list'),
  toggleAlbumGrid: ({toggleListType}) => () => toggleListType('album-grid'),
  toggleAlbumList: ({toggleListType}) => () => toggleListType('album-list')
})(LibraryListTypeToggle);
