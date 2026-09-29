import type { FC } from 'react';

export const DiscordPresenceWidget: FC = () => (
  <div className="shadow-shadow w-85 overflow-hidden rounded-lg bg-zinc-800 text-sm text-zinc-300">
    <div className="bg-primary h-15" />
    <div className="relative -mt-11 ml-4 size-22">
      <div className="bg-primary flex size-full items-center justify-center rounded-full border-6 border-zinc-800 text-3xl font-bold text-white">
        N
      </div>
      <span className="absolute right-0.5 bottom-0.5 size-6 rounded-full border-5 border-zinc-800 bg-green-600" />
    </div>
    <div className="m-4 mt-3 rounded-lg bg-zinc-950 p-3">
      <div className="text-xl font-semibold text-zinc-100">Nuki</div>
      <div>nuki.listens</div>
      <hr className="my-3 border-zinc-700" />
      <div className="mb-2 text-xs font-bold text-zinc-100 uppercase">
        Listening to Nuclear Music Player
      </div>
      <div className="flex items-center gap-3">
        <div className="relative size-15 shrink-0">
          <img
            src="/images/showcase/phosphor-dreams.jpg"
            alt="Phosphor Dreams cover"
            className="size-full rounded-lg object-cover"
          />
          <img
            src="/icon.png"
            alt="Nuclear"
            className="absolute -right-1 -bottom-1 size-5.5 rounded-full border-3 border-zinc-950"
          />
        </div>
        <div>
          <div className="font-semibold text-zinc-100">Phosphor Gate</div>
          <div>by Neon Cascade</div>
          <div>on Phosphor Dreams</div>
        </div>
      </div>
      <div className="mt-3 h-1 rounded-full bg-zinc-600">
        <div className="h-full w-[38%] rounded-full bg-zinc-100" />
      </div>
      <div className="mt-1 flex justify-between text-xs tabular-nums">
        <span>1:34</span>
        <span>4:07</span>
      </div>
    </div>
  </div>
);
