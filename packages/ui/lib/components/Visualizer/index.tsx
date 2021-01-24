import React, { useCallback, useEffect, useRef, useState } from 'react';
import butterchurn from 'butterchurn';
import butterchurnPresets from 'butterchurn-presets';

export type VisualizerProps = {
  audioContext: AudioContext;
  audioNode?: AudioNode;
}

const Visualizer: React.FC<VisualizerProps> = ({
  audioContext,
  audioNode
}) => {
  const canvasRef = useRef();
  const [visualizer, setVisualizer] = useState();

  const startRendering = useCallback(() => {
    requestAnimationFrame(() => startRendering());
    visualizer.render();
  }, [visualizer]);

  useEffect(() => {
    if (canvasRef.current) {
      setVisualizer(butterchurn.createVisualizer(audioContext, canvasRef.current, {
        width: 300,
        height: 300,
        textureRatio: 1
      }));
    }
  }, [canvasRef, audioNode, audioContext]);

  useEffect(() => {
    if (!audioNode || !visualizer) {
      return;
    }

    visualizer.connectAudio(audioNode);
    const presets = butterchurnPresets.getPresets();
    const preset = presets['Flexi, martin + geiss - dedicated to the sherwin maxawow'];

    visualizer.loadPreset(preset, 0.0);

    visualizer.setRendererSize(300, 300);
    startRendering();
  }, [audioNode, visualizer, startRendering]);

  return <div>
    {
      audioNode &&
      <canvas ref={canvasRef} width={300} height={300} />
    }
  </div>;
};

export default Visualizer;
