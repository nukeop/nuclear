import React from 'react';

import styles from './styles.scss';

import PlayerButton from './PlayerButton';
import PlayPauseButton from './PlayPauseButton';
import { useTranslation } from 'react-i18next';

const PlayerControls = ({ back, togglePlay, playing, loading, forward }) => {
  const { t } = useTranslation('player');

  return (
    <div className={styles.player_controls_container}>
      <PlayerButton
        onClick={back}
        icon='step-backward'
        ariaLabel={t('previous-button')}
      />
      <PlayPauseButton
        onClick={togglePlay}
        playing={playing}
        loading={loading}
      />
      <PlayerButton
        onClick={forward}
        icon='step-forward'
        ariaLabel={t('next-button')}
      />
    </div>
  );
};

export default PlayerControls;
