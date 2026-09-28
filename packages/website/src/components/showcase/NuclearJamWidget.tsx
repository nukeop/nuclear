import type { FC } from 'react';

import { NuclearJam } from '@nuclearplayer/ui';

export const NuclearJamWidget: FC = () => (
  <NuclearJam.Content className="surface-background text-foreground border-border shadow-shadow w-full overflow-hidden rounded-md border-(length:--border-width) select-none">
    <div className="flex items-center gap-3 px-4 py-3">
      <img
        src="/images/showcase/phosphor-dreams.jpg"
        alt="Phosphor Dreams cover"
        className="border-border size-16 rounded-sm border-(length:--border-width) object-cover"
      />
      <div>
        <div className="font-black">Phosphor Gate</div>
        <div className="text-foreground/60 text-xs">Neon Cascade</div>
      </div>
    </div>
    <NuclearJam.Controls
      isPlaying={false}
      shuffleActive={false}
      repeatMode="off"
      progress={38}
      elapsedSeconds={94}
      remainingSeconds={153}
    />
  </NuclearJam.Content>
);
