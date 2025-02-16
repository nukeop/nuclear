import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Button,
  Divider,
  Icon,
  List,
  Segment,
  Progress
} from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import { compose, withHandlers } from 'recompose';

import styles from './styles.scss';

const LibraryFolders = ({
  openLocalFolderPicker,
  scanLocalFolders,
  onRemoveClick,
  localFolders,
  scanTotal,
  scanProgress,
  loading,
  t
}) => (
  <Segment className={styles.library_folders}>
    <Segment className={styles.control_bar}>
      <Button
        icon
        inverted
        labelPosition='left'
        onClick={openLocalFolderPicker}
      >
        <Icon name='folder open' />
        {t('add')}
      </Button>
      <Button
        inverted
        icon='refresh'
        disabled={_.isEmpty(localFolders)}
        loading={loading}
        onClick={scanLocalFolders}
        className={styles.refresh_icon} />
    </Segment>
    {
      scanTotal &&
      <Progress
        className={styles.progress_bar}
        value={scanProgress}
        total={scanTotal}
        indicating
        autoSuccess
        progress='ratio' />
    }
    {!_.isEmpty(localFolders) &&
      <>
        <Divider />
        <List
          divided
          verticalAlign='middle'
          className={styles.list}>
          {localFolders.map((folder, idx) => (
            <List.Item key={idx}>
              <List.Content floated='right'>
                <Icon
                  name='close'
                  onClick={() => onRemoveClick(folder)}
                  className={styles.folder_remove_icon} />
              </List.Content>
              <List.Content>{folder}</List.Content>
            </List.Item>
          ))}
        </List>
      </>}
  </Segment>
);

LibraryFolders.propTypes = {
  openLocalFolderPicker: PropTypes.func,
  scanLocalFolders: PropTypes.func,
  removeLocalFolder: PropTypes.func,
  localFolders: PropTypes.array,
  loading: PropTypes.bool
};

export default compose(
  withTranslation('library'),
  withHandlers({
    onRemoveClick: ({removeLocalFolder}) => folder => removeLocalFolder(folder)
  })
)(LibraryFolders);
