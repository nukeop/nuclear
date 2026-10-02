import { ComponentProps, FC } from 'react';

import type {
  LyricsVocalist,
  PlainLyrics as PlainLyricsModel,
} from '@nuclearplayer/model';

import { cn } from '../../../utils';
import { PlainLyricsSection } from './PlainLyricsSection';

type PlainLyricsProps = Omit<ComponentProps<'div'>, 'children'> & {
  sections: PlainLyricsModel['sections'];
  vocalists?: LyricsVocalist[];
};

export const PlainLyrics: FC<PlainLyricsProps> = ({
  sections,
  vocalists = [],
  className,
  ...props
}) => (
  <div
    className={cn(
      'font-heading flex flex-col gap-6 text-3xl leading-tight font-bold tracking-tight font-stretch-semi-condensed',
      className,
    )}
    {...props}
  >
    {sections.map((section, index) => (
      <PlainLyricsSection key={index} section={section} vocalists={vocalists} />
    ))}
  </div>
);
