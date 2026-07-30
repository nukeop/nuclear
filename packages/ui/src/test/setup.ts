import '@testing-library/jest-dom';

import { MotionGlobalConfig } from 'motion/react';

import { setupDomMocks } from './domMocks';

process.env.TZ = 'UTC';

setupDomMocks();

MotionGlobalConfig.skipAnimations = true;
MotionGlobalConfig.instantAnimations = true;

vi.mock('motion/react', async (importOriginal) => {
  const mod = await importOriginal<typeof import('motion/react')>();
  const mockMod = await import('./mockFramerMotion');
  const factory = mockMod.createFramerMotionMock;
  return factory(mod);
});
