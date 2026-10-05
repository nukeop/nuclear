import { useCurrentFrame } from 'remotion';

const FRAMES_PER_CHARACTER = 2;
const CARET_BLINK_FRAMES = 30;

export const typingEndFrame = (text: string, startFrame: number) =>
  startFrame + text.length * FRAMES_PER_CHARACTER;

export const useTypedText = (text: string, startFrame: number) => {
  const frame = useCurrentFrame();
  const typedCount = Math.min(
    text.length,
    Math.max(0, Math.floor((frame - startFrame) / FRAMES_PER_CHARACTER)),
  );
  const isTyping = typedCount < text.length;
  const framesSinceTyped = frame - typingEndFrame(text, startFrame);
  const isBlinkOn =
    framesSinceTyped % CARET_BLINK_FRAMES < CARET_BLINK_FRAMES / 2;

  return {
    typed: text.slice(0, typedCount),
    isCaretVisible: isTyping || isBlinkOn,
  };
};
