import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

import styles from './styles.scss';

const UserPluginsSectionComponent = props => {
  return (
    <section className={styles.user_plugins_section}>
    <Button icon inverted>
    <Icon name='plus' />
    Add a plugin
    </Button>
    </section>
  );
}

UserPluginsSectionComponent.propTypes = {

};

export default UserPluginsSectionComponent;
