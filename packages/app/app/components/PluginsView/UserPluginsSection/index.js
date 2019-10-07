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

};

export default compose(
  withHandlers({
    handleAddPlugin: () => async () => {
      let dialogResult = remote.dialog.showOpenDialog({
        filters: [{name: 'Javascript files', extensions: ['js', 'jsx']}]
      });
      if (_.isNil(dialogResult)) {
        return;
      }
      const pluginContents = await fs.promises.readFile(_.head(dialogResult), 'utf8');
      const plugin = eval(pluginContents);
      const api = createApi();
      console.log(plugin, api);
      plugin.start(api);
    }
  })
)(UserPluginsSectionComponent);
