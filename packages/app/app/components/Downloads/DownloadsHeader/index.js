import React from 'react';
import PropTypes from 'prop-types';
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
}) => {
  return (
    <Segment className={styles.downloads_header}>
      <span className={styles.label}>
        Saving in:
        <span className={styles.directory}>
          { directory }
        </span>
      </span>
      <Button
        icon
        inverted
        labelPosition='left'
        onClick={setDirectory}
      >
        <Icon name='folder open' />
        { t('downloads-dir-button') }
      </Button>
    </Segment>
  );
};

DownloadsHeader.propTypes = {
  directory: PropTypes.string,
  setDirectory: PropTypes.func,
  setStringOption: PropTypes.func
};

DownloadsHeader.defaultProps = {
  directory: '',
  setDirectory: () => {},
  setStringOption: () => {}
};

export default compose(
  withTranslation('settings'),
  withHandlers({
    setDirectory: ({setStringOption}) => () => {
      let dialogResult = remote.dialog.showOpenDialog({
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
