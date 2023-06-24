import React from 'react';
import { Button, Popup } from 'semantic-ui-react';

import VolumeControls, { VolumeControlsProps } from '../VolumeControls';
import styles from './styles.scss';

export type VolumePopUpProps = VolumeControlsProps;

const VolumePopUp: React.FC<VolumeControlsProps> = ({
  volume,
  updateVolume,
  toggleMute,
  isMuted,
  playOptions,
  updatePlaybackRate,
  playbackRate,
  isPlaybackRateOpen
}) => (
  <Popup
    trigger={
      <div className={styles.volume_popup_container}>
        <Button className={styles.volume_popup_button} icon='ellipsis horizontal' />
      </div>
    }
    className={styles.volume_popup}
    flowing
    hoverable
    basic
    inverted
  >
    <VolumeControls
      volume={volume}
      updateVolume={updateVolume}
      toggleMute={toggleMute}
      isMuted={isMuted}
      playOptions={playOptions}
      updatePlaybackRate={updatePlaybackRate}
      playbackRate={playbackRate}
      isPlaybackRateOpen={isPlaybackRateOpen}
    />
  </Popup>
);

export default VolumePopUp;
