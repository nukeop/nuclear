import React from 'react';
import PropTypes from 'prop-types';
import fs from 'fs';
import { Button, Icon, Segment } from 'semantic-ui-react';
import { remote } from 'electron';
import { compose, withHandlers } from 'recompose';

import createApi from '../../../plugins/api';
import Warning from './Warning';
import styles from './styles.scss';

const UserPluginsSectionComponent = ({handleAddPlugin}) => {
  return (
    <Segment className={styles.user_plugins_section}>
      <Warning />
      <Button icon inverted onClick={handleAddPlugin}>
        <Icon name='plus' />
        Add a plugin
      </Button>
    </Segment>
  );
};

UserPluginsSectionComponent.propTypes = {
  /* eslint-disable react/no-unused-prop-types */
  loadUserPlugin: PropTypes.func,
  userPlugins: PropTypes.objectOf(PropTypes.shape({
    path: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(null)
    ])
  }))
  /* eslint-enable */
};

export default compose(
  withHandlers({
    handleAddPlugin: ({loadUserPlugin}) => async () => {
      let dialogResult = remote.dialog.showOpenDialog({
        filters: [{name: 'Javascript files', extensions: ['js', 'jsx']}]
      });
      if (!_.isNil(dialogResult)) {
        const api = createApi();
        loadUserPlugin(_.head(dialogResult), api);
      }
    }
  })
)(UserPluginsSectionComponent);
