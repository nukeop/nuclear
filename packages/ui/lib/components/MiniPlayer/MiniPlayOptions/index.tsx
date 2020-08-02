import React, { useCallback, useState } from 'react';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';

import NeumorphicBox from '../../NeumorphicBox';
import { VolumeControlsProps } from '../../VolumeControls';
import { PlayOptionControlProps } from '../../VolumeControls/PlayOptions';

import styles from './styles.scss';

export type MiniPlayOptionsProps = Pick<VolumeControlsProps, 'playOptions'> & {
  onDisableMiniPlayer: () => void;
};

const MiniPlayOptionControl: React.FC<PlayOptionControlProps> = ({
  icon,
  enabled = true,
  onToggle
}) => <button
  onClick={onToggle}
>
    <Icon
      className={cx({ disabled: !enabled })}
      name={icon}
      size='large'
    />
  </button>

const MiniPlayOptions: React.FC<MiniPlayOptionsProps> = ({
  onDisableMiniPlayer,
  playOptions
}) => {
  const [isExpanded, setExpanded] = useState(false);
  const expand = useCallback(() => setExpanded(true), [setExpanded]);
  const contract = useCallback(() => setExpanded(false), [setExpanded]);

  return <div className={styles.mini_play_options}>
    <NeumorphicBox small borderRadius='5px'>
      <button
        onClick={onDisableMiniPlayer}
      >
        <Icon
          size='large'
          name='chevron left'
        />
      </button>
    </NeumorphicBox>
    <NeumorphicBox small borderRadius='5px'>
      <button
        onClick={isExpanded ? contract : expand}
      >
        <Icon
          size='large'
          name='ellipsis horizontal'
        />
      </button>
      {
        isExpanded && playOptions.map(playOption => <MiniPlayOptionControl {...playOption} />)
      }
    </NeumorphicBox>
  </div>
};

export default MiniPlayOptions;