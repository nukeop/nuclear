import { $ } from 'bun';

const config = {
  start: {
    title: 'AI agent is taking control of the screen',
    message: 'Hands off. Starting in 5 seconds.',
    sound: '/System/Library/Sounds/Hero.aiff',
    waitMs: 4000,
  },
  stop: {
    title: 'AI agent is done',
    message: 'The screen is yours.',
    sound: '/System/Library/Sounds/Glass.aiff',
    waitMs: 0,
  },
};

type Signal = keyof typeof config;

const isSignal = (value: string | undefined): value is Signal =>
  value !== undefined && value in config;

const signalName = Bun.argv[2];
if (!isSignal(signalName)) {
  throw new Error('Usage: bun screen-control.ts start|stop');
}

const signal = config[signalName];
await $`osascript -e ${`display notification "${signal.message}" with title "${signal.title}"`}`;
await $`afplay ${signal.sound}`;
await Bun.sleep(signal.waitMs);
