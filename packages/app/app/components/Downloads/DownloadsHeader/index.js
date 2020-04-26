import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Button,
  Icon,
  Segment
} from 'semantic-ui-react';
import { remote } from 'electron';
import { withTranslation } from 'react-i18next';
import { compose, withHandlers } from 'recompose';

import styles from './styles.scss';

const DownloadsHeader = ({
  directory,
  setDirectory,
  t
}) => (
  <Segment className={styles.downloads_header}>
    <span className={styles.label}>
      Saving in:
      <span className={styles.directory}>
        { _.isEmpty(directory) ? remote.app.getPath('downloads') : directory}
      </span>
    </span>
    <Button
      icon
      inverted
      labelPosition='left'
      onClick={setDirectory}
    >
      <Icon name='folder open' />
      {t('downloads-dir-button')}
    </Button>
  </Segment>
);

DownloadsHeader.propTypes = {
  directory: PropTypes.string,
  setDirectory: PropTypes.func,
  setStringOption: PropTypes.func
};

DownloadsHeader.defaultProps = {
  directory: remote.app.getPath('downloads'),
  setDirectory: () => { },
  setStringOption: () => { }
};

export default compose(
  withTranslation('settings'),
  withHandlers({
    setDirectory: ({ setStringOption }) => () => {
      const dialogResult = remote.dialog.showOpenDialog({
        properties: ['openDirectory']
      });
      if (!_.isNil(dialogResult)) {
        setStringOption(
          'downloads.dir',
          _.head(dialogResult)
        );
      }
    }
  })
)(DownloadsHeader);
