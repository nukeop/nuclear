import { ElementType, forwardRef, ReactNode } from 'react';

export const createFramerMotionMock = (mod: typeof import('motion/react')) => {
  const isDataProp = (key: string) => key.startsWith('data-');

  const make = (Tag: ElementType) =>
    forwardRef<unknown, { children?: ReactNode } & Record<string, unknown>>(
      (
        { children, className, animate, exit, initial, transition, ...rest },
        ref,
      ) => {
        const Comp = Tag as ElementType;
        const domSafeProps = Object.fromEntries(
          Object.entries(rest).filter(([key]) => isDataProp(key)),
        );
        return (
          <Comp
            ref={ref}
            className={className}
            animate={animate}
            exit={exit}
            initial={initial}
            transition={transition}
            {...domSafeProps}
          >
            {children}
          </Comp>
        );
      },
    );

  const cache = new Map<string, ReturnType<typeof make>>();
  const motion = new Proxy(
    {},
    {
      get: (_target, el: string) => {
        const key = String(el);
        if (!cache.has(key)) {
          cache.set(key, make(el as unknown as ElementType));
        }
        return cache.get(key)!;
      },
    },
  ) as typeof mod.motion;

  const AnimatePresence = ({ children }: { children?: ReactNode }) => (
    <>{children}</>
  );

  const MotionConfig = ({ children }: { children?: ReactNode }) => (
    <>{children}</>
  );

  return {
    ...mod,
    motion,
    AnimatePresence,
    MotionConfig,
    useReducedMotion: () => true,
    MotionGlobalConfig: { ...mod.MotionGlobalConfig, skipAnimations: true },
  } as typeof import('motion/react');
};

export default createFramerMotionMock;
