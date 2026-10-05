import { EXIT_FRAMES } from '../motion';
import { voiceLineEndFrame } from '../VoiceOver';
import { paginate } from './paginate';
import { CaptionGroup, CaptionLine, CaptionPage } from './types';

const MAX_GAP_FRAMES = 20;

const splitIntoRuns = (lines: CaptionLine[]) =>
  [...lines]
    .sort((first, second) => first.startFrame - second.startFrame)
    .reduce<CaptionLine[][]>((runs, line) => {
      const lastRun = runs.at(-1);
      const previousLine = lastRun?.at(-1);
      const continuesRun =
        lastRun !== undefined &&
        previousLine !== undefined &&
        line.startFrame - voiceLineEndFrame(previousLine) <= MAX_GAP_FRAMES;

      if (continuesRun) {
        return [...runs.slice(0, -1), [...lastRun, line]];
      }
      return [...runs, [line]];
    }, []);

const characterCount = (texts: string[]) =>
  texts.reduce((total, text) => total + text.length, 0);

const timePages = (line: CaptionLine, groupStartFrame: number) => {
  const texts = paginate(line.text);
  const totalCharacters = characterCount(texts);

  return texts.map((text, pageIndex): CaptionPage => {
    const charactersBefore = characterCount(texts.slice(0, pageIndex));
    const offset = Math.round(
      (line.durationInFrames * charactersBefore) / totalCharacters,
    );

    return { text, startFrame: line.startFrame - groupStartFrame + offset };
  });
};

const toGroup = (run: CaptionLine[]): CaptionGroup => {
  const startFrame = run[0].startFrame;
  const lastLine = run[run.length - 1];

  return {
    startFrame,
    durationInFrames: voiceLineEndFrame(lastLine) - startFrame + EXIT_FRAMES,
    pages: run.flatMap((line) => timePages(line, startFrame)),
  };
};

export const groupCaptions = (lines: CaptionLine[]) =>
  splitIntoRuns(lines).map(toGroup);
