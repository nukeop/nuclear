import React from 'react';
import { Icon, SemanticICONS, SemanticSIZES } from 'semantic-ui-react';

import styles from './styles.scss';

export type PlayerButtonProps = {
  icon: SemanticICONS;
  size?: Exclude<SemanticSIZES, 'medium'>;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent) => void;
  loading?: boolean;
};

const PlayerButton: React.FC<PlayerButtonProps> = ({
  icon,
  size = 'big',
  ariaLabel,
  onClick,
  loading = false
}) => (
    <button
      className={styles.player_button}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <Icon inverted loading={loading} name={icon} size={size} />
    </button>
  );

export default PlayerButton;