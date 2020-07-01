import React from 'react';
import { Icon, SemanticICONS } from 'semantic-ui-react';

import styles from './styles.scss';

export type PlayOptionControlProps = {
  icon: SemanticICONS;
  enabled?: boolean;
  onToggle?: () => void;
};

const PlayOptionControl: React.FC<PlayOptionControlProps> = ({
  icon,
  enabled = true,
  onToggle
}) => (
    <Icon
      className={styles.play_option_icon}
      name={icon}
      disabled={!enabled}
      onClick={onToggle}
      size='big'
    />
  );

export type PlayOptionsProps = {
  playOptions: PlayOptionControlProps[]
};

const PlayOptions: React.FC<PlayOptionsProps> = ({
  playOptions
}) => (
    <div className={styles.play_options}>
      {
        playOptions.map(playOption => <PlayOptionControl {...playOption} />)
      }
    </div>
  )

export default PlayOptions;