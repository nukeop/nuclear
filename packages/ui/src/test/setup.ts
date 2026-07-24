import '@testing-library/jest-dom';

import { MotionGlobalConfig } from 'motion/react';

import { setupMatchMediaMock } from './matchMediaMock';
import { setupResizeObserverMock } from './resizeObserverMock';

process.env.TZ = 'UTC';

setupMatchMediaMock();
setupResizeObserverMock();

Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
Element.prototype.setPointerCapture = vi.fn();
Element.prototype.releasePointerCapture = vi.fn();
Element.prototype.scrollIntoView = vi.fn();
globalThis.CSS = { supports: () => true } as unknown as typeof CSS;
(SVGElement.prototype as SVGGraphicsElement).getBBox = vi
  .fn()
  .mockReturnValue({ x: 0, y: 0, width: 0, height: 0 });

MotionGlobalConfig.skipAnimations = true;
MotionGlobalConfig.instantAnimations = true;

vi.mock('motion/react', async (importOriginal) => {
  const mod = await importOriginal<typeof import('motion/react')>();
  const mockMod = await import('./mockFramerMotion');
  const factory = mockMod.createFramerMotionMock;
  return factory(mod);
});
