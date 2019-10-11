import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Segment } from 'semantic-ui-react';
import { remote } from 'electron';
import { compose, withHandlers } from 'recompose';
import { UserPluginsItem } from '@nuclear/ui';

import createApi from '../../../plugins/api';
import Warning from './Warning';
import styles from './styles.scss';

const UserPluginsSectionComponent = ({
  handleAddPlugin,
  deleteUserPlugin,
  userPlugins
}) => {
  return (
    <Segment className={styles.user_plugins_section}>
      <Warning />
      <hr />
      <Button icon inverted onClick={handleAddPlugin}>
        <Icon name='plus' />
        Add a plugin
      </Button>
      {
        userPlugins &&
        _.map(userPlugins, plugin => (
          <UserPluginsItem
            key={plugin.path}
            path={plugin.path}
            name={plugin.name}
            description={plugin.description}
            image={plugin.image}
            author={plugin.author}
            loading={plugin.loading}
            error={plugin.error}
            deleteUserPlugin={deleteUserPlugin}
          />
        ))
      }
    </Segment>
  );
};

UserPluginsSectionComponent.propTypes = {
  /* eslint-disable react/no-unused-prop-types */
  loadUserPlugin: PropTypes.func,
  deleteUserPlugin: PropTypes.func,
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
    handleAddPlugin: ({loadUserPlugin}) => () => {
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
