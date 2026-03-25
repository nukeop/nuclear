import '@testing-library/jest-dom';

import { MotionGlobalConfig } from 'motion/react';

import { setupResizeObserverMock } from './resizeObserverMock';

process.env.TZ = 'UTC';

setupResizeObserverMock();

Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
Element.prototype.setPointerCapture = vi.fn();
Element.prototype.releasePointerCapture = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

MotionGlobalConfig.skipAnimations = true;
MotionGlobalConfig.instantAnimations = true;

vi.mock('motion/react', async (importOriginal) => {
  const mod = await importOriginal<typeof import('motion/react')>();
  const mockMod = await import('./mockFramerMotion');
  const factory = mockMod.createFramerMotionMock;
  return factory(mod);
});
