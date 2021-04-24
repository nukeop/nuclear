import React from 'react';

import VolumeControls, { VolumeControlsProps } from '../VolumeControls';

import { Button, Popup } from 'semantic-ui-react';

export type VolumePopUpProps = VolumeControlsProps;

const VolumePopUp: React.FC<VolumeControlsProps> = ({
  volume,
  updateVolume,
  toggleMute,
  isMuted,
  playOptions
}) => (
  <Popup trigger={<Button>More</Button>} flowing hoverable basic inverted>
    <VolumeControls
      volume={volume}
      updateVolume={updateVolume}
      toggleMute={toggleMute}
      isMuted={isMuted}
      playOptions={playOptions}
    />
  </Popup>
);

export default VolumePopUp;
