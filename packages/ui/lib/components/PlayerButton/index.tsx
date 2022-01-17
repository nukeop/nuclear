import React from 'react';
import cx from 'classnames';
import { Icon, SemanticICONS, SemanticSIZES } from 'semantic-ui-react';

import styles from './styles.scss';

export type PlayerButtonProps = {
  'data-testid'?: string;
  icon: SemanticICONS;
  size?: Exclude<SemanticSIZES, 'medium'>;
  ariaLabel?: string;
  onClick?: React.DOMAttributes<HTMLButtonElement>['onClick'];
  disabled?: boolean;
  loading?: boolean;
};

const PlayerButton: React.FC<PlayerButtonProps> = ({
  icon,
  size = 'big',
  ariaLabel,
  onClick,
  disabled = false,
  loading = false,
  ...rest
}) => (
  <button
    data-testid={rest['data-testid']}
    className={cx(
      styles.player_button,
      { [styles.disabled]: disabled }
    )}
    aria-label={ariaLabel}
    onClick={disabled ? undefined : onClick}
  >
    <Icon inverted loading={loading} name={icon} size={size} />
  </button>
);

export default PlayerButton;
