import React, { useEffect, useRef } from 'react';
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
  useEffect(() => {
    if (canvasRef.current) {
      const visualizer = butterchurn.createVisualizer(audioContext, canvasRef.current, {
        width: 800,
        height: 600
      });

      visualizer.connectAudio(audioNode);
      const presets = butterchurnPresets.getPresets();
      const preset = presets['Flexi, martin + geiss - dedicated to the sherwin maxawow'];

      visualizer.loadPreset(preset, 0.0);

      visualizer.setRendererSize(1600, 1200);

      visualizer.render();
    }
  }, [canvasRef, audioContext, audioNode]);

  return <div>
    {
      audioNode &&
      <canvas ref={canvasRef} />
    }
  </div>;
};

export default Visualizer;
