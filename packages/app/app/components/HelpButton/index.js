import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

import styles from './styles.scss';

const HelpButton = props => {
  return (
    <Button icon
      data-testid='help-button'
      className={styles.help_button}
      {...props}
    >
      <Icon name='question circle outline'/>
    </Button>
  );
};

export default HelpButton;
