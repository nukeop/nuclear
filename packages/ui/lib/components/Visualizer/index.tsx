import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import butterchurn from 'butterchurn';
import butterchurnPresets from 'butterchurn-presets';
import Measure from 'react-measure';
import _ from 'lodash';

export type VisualizerProps = {
  audioContext: AudioContext;
  previousNode?: AudioNode;
  location?: Location;
  presetName: string;
}

type Size = {
  x: number;
  y: number;
}

type ButterchurnVisualizer = {
  render: () => void;
  setRendererSize: (x: number, y: number) => void;
  connectAudio: (audioNode: AudioNode) => void;
  loadPreset: (preset, blendTime: number) => void;
}

const Visualizer: React.FC<VisualizerProps> = ({
  audioContext,
  previousNode,
  location,
  presetName
}) => {
  const canvasRef = useRef();
  const [canvasSize, setCanvasSize] = useState<Size>({ x: 0, y: 0 });
  const [visualizerNode, setVisualizerNode] = useState<HTMLElement>();
  const [visualizer, setVisualizer] = useState<ButterchurnVisualizer>();
  const startRendering = useCallback(() => {
    requestAnimationFrame(() => startRendering());
    visualizer?.render();
  }, [visualizer]);

  useEffect(() => {
    if (canvasRef.current) {
      setVisualizer(butterchurn.createVisualizer(audioContext, canvasRef.current, {
        width: canvasSize.x,
        height: canvasSize.y,
        textureRatio: 1
      }));
    }
  }, [canvasRef, canvasSize, visualizerNode, previousNode, audioContext]);

  useEffect(() => {
    visualizer?.setRendererSize(canvasSize.x, canvasSize.y);
  }, [visualizer, canvasSize]);

  useLayoutEffect(() => {
    setVisualizerNode(document.getElementById('visualizer_node'));
  }, [location]);

  useEffect(() => {
    if (!previousNode || !visualizer) {
      return;
    }
    visualizer?.connectAudio(previousNode);

    const presets = butterchurnPresets.getPresets();
    const preset = presets[presetName];
    visualizer?.loadPreset(preset, 0.0);

    visualizer?.setRendererSize(canvasSize.x, canvasSize.y);
    startRendering();
  }, [previousNode, visualizerNode, visualizer, canvasSize, startRendering, presetName]);

  return visualizerNode
    ? ReactDOM.createPortal(
      previousNode && visualizerNode &&
      <Measure
        bounds
        onResize={_.debounce((contentRect) => setCanvasSize({x: contentRect.bounds.width, y: contentRect.bounds.height}), 2000)}
      >
        {
          ({ measureRef }) => (
            <div ref={measureRef}>
              <canvas ref={canvasRef} width={canvasSize.x} height={canvasSize.y} />
            </div>
          )
        }
      </Measure>,
      visualizerNode
    )
    : null;
};

export default Visualizer;
