import React, { FC, useCallback } from 'react';
import electron, { dialog } from 'electron';
import _ from 'lodash';
import { Button, Icon, Segment } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import { UserPluginsItem } from '@nuclear/ui';

import Warning from './Warning';
import styles from './styles.scss';

type UserPlugin = {
  path: string;
  name: string;
  description: string;
  image: string | null;
  author: string;
  loading: boolean;
  error: boolean;
}

type UserPluginsSectionProps = {
  deleteUserPlugin: (path: string) => void;
  loadUserPlugin: (path: string) => void;
  userPlugins: Record<string, UserPlugin>;
  t: (key: string) => string;
}

const UserPluginsSectionComponent: FC<UserPluginsSectionProps> = ({
  deleteUserPlugin,
  loadUserPlugin,
  userPlugins,
  t
}) => {
  const handleAddPlugin = useCallback(async () => {
    const dialogResult = await dialog.showOpenDialog({
      filters: [{ name: 'Javascript files', extensions: ['js', 'jsx'] }]
    });

    if (!dialogResult.canceled && !_.isEmpty(dialogResult.filePaths)) {
      loadUserPlugin(_.head(dialogResult.filePaths));
    }
  }, [loadUserPlugin]);

  const handleAuthorClick = useCallback((author: string) => {
    electron.shell.openExternal(`https://github.com/${author}`);
  }, []);

  return (
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
};

export default withTranslation('plugins')(UserPluginsSectionComponent);
