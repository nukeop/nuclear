import React, { useEffect, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import butterchurnPresets from 'butterchurn-presets';

import { Visualizer, VisualizerOverlay } from '../..';

export default {
  title: 'Components/Visualizer'
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

  const handle = useFullScreenHandle();

  return <>
    <FullScreen handle={handle}>
      <div
        id='visualizer_node'
        style={{ height: '100%', width: '100%' }}
      >
        <VisualizerOverlay
          presets={['preset 1', 'preset 2', 'preset 3']}
          selectedPreset='preset 2'
          onPresetChange={() => { }}
          onEnterFullscreen={handle.enter}
        />
      </div>
      <Visualizer
        audioContext={audioContext}
        previousNode={audioNode}
        presetName={preset}
        trackName='Test track'
      />
    </FullScreen>
  </>;
};

export const VisualizerControls = () => <VisualizerOverlay
  presets={['preset 1', 'preset 2', 'preset 3']}
  selectedPreset='preset 2'
  onPresetChange={() => { }}
  onEnterFullscreen={() => alert('Entered fullscreen')}
/>;
