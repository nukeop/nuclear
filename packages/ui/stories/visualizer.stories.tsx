import React, { useEffect, useState } from 'react';
import butterchurnPresets from 'butterchurn-presets';

import { Visualizer } from '..';

export default {
  title: 'Visualizer'
};

export const Mic = () => {
  const [audioNode, setAudioNode] = useState<AudioNode>();
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [preset, setPreset] = useState<string>();
  useEffect(() => {
    if (!audioContext) {
      return;
    }

    const presets = butterchurnPresets.getPresets();
    setPreset(_.sample(Object.keys(presets)));

    const getMic = async () => {
      const mic = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
      const micNode = audioContext.createMediaStreamSource(mic);
      audioContext.resume();
      const gain = audioContext.createGain();
      gain.gain.value = 1.25;
      micNode.connect(gain);
      setAudioNode(gain);
    };
    getMic();
  }, [audioContext]);

  useEffect(() => {
    setAudioContext(new window.AudioContext());
  }, []);


  return <>
    <div id='visualizer_node' />
    <Visualizer
      audioContext={audioContext}
      previousNode={audioNode}
      presetName={preset}
    />
  </>;
};
