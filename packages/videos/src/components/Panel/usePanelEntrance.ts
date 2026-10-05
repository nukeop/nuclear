import {
  spring,
  SpringConfig,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const PANEL_SPRING: Partial<SpringConfig> = {
  stiffness: 220,
  damping: 26,
  overshootClamping: true,
};

export const usePanelEntrance = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return spring({ frame, fps, config: PANEL_SPRING });
};
