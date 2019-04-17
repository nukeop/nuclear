import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

import styles from './styles.scss';

const HelpButton = props => {
  return (
    <Button icon
      className={styles.help_button}
      { ...props }
    >
      <Icon name='question circle outline'/>
    </Button>
  );
};

HelpButton.propTypes = {

};

HelpButton.defaultProps = {

};

export default HelpButton;
