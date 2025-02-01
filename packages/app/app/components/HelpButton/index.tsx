import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

import styles from './styles.scss';

type HelpButtonProps = {
  onClick: () => void;
}

const HelpButton: React.FC<HelpButtonProps> = ({ onClick }) => (
  <Button
    icon
    data-testid='help-button'
    className={styles.help_button}
    onClick={onClick}
  >
    <Icon name='question circle outline'/>
  </Button>
);

export default HelpButton;
