import React, { useEffect, useState } from 'react';

import { Visualizer } from '..';

export default {
  title: 'Visualizer'
};

export const Static = () => {
  const [audioNode, setAudioNode] = useState<AudioNode>();
  const [audioContext, setAudioContext] = useState<AudioContext>();
  useEffect(() => {
    if (!audioContext) {
      return;
    }
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
    <Visualizer
      audioContext={audioContext}
      audioNode={audioNode}
    />
  </>;
};
