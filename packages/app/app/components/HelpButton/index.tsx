import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

import styles from './styles.scss';

type HelpButtonProps = {
  onClick: () => void;
  [x: string]: any;
}

const HelpButton: React.FC<HelpButtonProps> = ({
  onClick,
  ...rest
}) => (
  <Button
    icon
    data-testid='help-button'
    className={styles.help_button}
    onClick={onClick}
    {...rest}
  >
    <Icon name='question circle outline'/>
  </Button>
);

export default HelpButton;
