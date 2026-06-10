import { FC } from 'react';

import type { Stream } from '@nuclearplayer/model';

type StreamQualityInfoProps = {
  stream: Stream;
};

export const StreamQualityInfo: FC<StreamQualityInfoProps> = ({ stream }) => {
  const parts = [
    stream.qualityLabel,
    stream.bitrateKbps && `${stream.bitrateKbps} kbps`,
    stream.codec,
  ].filter(Boolean);

  return parts.length ? (
    <div className="text-foreground shrink-0 border-x-0 border-y-2 px-3 py-1.5 text-xs">
      {parts.join(' · ')}
    </div>
  ) : null;
};
