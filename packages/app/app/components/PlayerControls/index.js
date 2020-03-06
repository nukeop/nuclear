import React, {useEffect} from 'react';

import styles from './styles.scss';

import PlayerButton from './PlayerButton';
import PlayPauseButton from './PlayPauseButton';
import { useTranslation } from 'react-i18next';

const PlayerControls = ({ back, togglePlay, playing, loading, forward }) => {
  const { t } = useTranslation('player');

  const handleMediaKeys = event => {
    switch (event.key) {
    case 'MediaPlayPause': {
      if (togglePlay) {
        togglePlay();
      }
      return;
    }

    case 'MediaTrackNext': {
      if (forward) {
        forward();
      }
      return;
    }

    case 'MediaTrackPrevious': {
      if (back) {
        back();
      }
      return;
    }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleMediaKeys);
    return () =>
      document.removeEventListener('keydown', handleMediaKeys);
  }, [togglePlay, back, forward, handleMediaKeys]);

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
