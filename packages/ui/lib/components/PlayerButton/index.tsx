import React from 'react';
import cx from 'classnames';
import { Icon, SemanticICONS, SemanticSIZES } from 'semantic-ui-react';

import styles from './styles.scss';

export type PlayerButtonProps = {
  icon: SemanticICONS;
  size?: Exclude<SemanticSIZES, 'medium'>;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  loading?: boolean;
};

const PlayerButton: React.FC<PlayerButtonProps> = ({
  icon,
  size = 'big',
  ariaLabel,
  onClick,
  disabled = false,
  loading = false
}) => (
    <button
      className={cx(
        styles.player_button, 
        { [styles.disabled]: disabled }
        )}
      aria-label={ariaLabel}
      onClick={!disabled && onClick}
    >
      <Icon inverted loading={loading} name={icon} size={size} />
    </button>
  );

export default PlayerButton;