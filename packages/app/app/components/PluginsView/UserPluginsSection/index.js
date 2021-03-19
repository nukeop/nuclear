import React from 'react';
import PropTypes from 'prop-types';
import electron, { remote } from 'electron';
import _ from 'lodash';
import { Button, Icon, Segment } from 'semantic-ui-react';
import { compose, withHandlers } from 'recompose';
import { withTranslation } from 'react-i18next';
import { UserPluginsItem } from '@nuclear/ui';

import Warning from './Warning';
import styles from './styles.scss';

const UserPluginsSectionComponent = ({
  handleAddPlugin,
  deleteUserPlugin,
  handleAuthorClick,
  userPlugins,
  t
}) => (
  <Segment className={styles.user_plugins_section}>
    <Warning />
    <hr />
    <Button icon inverted onClick={handleAddPlugin}>
      <Icon name='plus' />
      {t('add-a-plugin')}
    </Button>
    {userPlugins &&
      _.map(Object.values(userPlugins), (plugin, idx) => (
        <UserPluginsItem
          key={idx}
          path={plugin.path}
          name={plugin.name}
          description={plugin.description}
          image={plugin.image}
          author={plugin.author}
          loading={plugin.loading}
          error={plugin.error}
          deleteUserPlugin={deleteUserPlugin}
          onAuthorClick={handleAuthorClick} />
      ))}
  </Segment>
);

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
    handleAddPlugin: ({ loadUserPlugin }) => async () => {
      const dialogResult = await remote.dialog.showOpenDialog({
        filters: [{ name: 'Javascript files', extensions: ['js', 'jsx'] }]
      });

      if (!dialogResult.canceled && !_.isEmpty(dialogResult.filePaths)) {
        loadUserPlugin(_.head(dialogResult.filePaths));
      }
    },
    handleAuthorClick: () => author => {
      electron.shell.openExternal(`https://github.com/${author}`);
    }
  }),
  withTranslation('plugins')
)(UserPluginsSectionComponent);
