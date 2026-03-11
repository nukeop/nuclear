import {
  Outlet,
  RouterContextProvider,
  useMatches,
  useRouter,
} from '@tanstack/react-router';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { forwardRef, useRef } from 'react';

const SLIDE_DISTANCE = 24;
const SCALE_FACTOR = 0.96;

const slideVariants = {
  enter: {
    x: SLIDE_DISTANCE,
    scale: SCALE_FACTOR,
    opacity: 0,
    filter: 'blur(4px)',
  },
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: {
    x: -SLIDE_DISTANCE,
    scale: SCALE_FACTOR,
    opacity: 0,
    filter: 'blur(4px)',
  },
};

const AnimatedOutlet = forwardRef<HTMLDivElement>((_, ref) => {
  const router = useRouter();
  const isPresent = useIsPresent();
  const frozenState = useRef(router.__store.state);
  const frozenRouter = useRef(router);

  if (isPresent) {
    frozenState.current = router.__store.state;
    frozenRouter.current = router;
  } else if (frozenRouter.current === router) {
    const snapshot = frozenState.current;
    const storeProxy = Object.create(router.__store) as typeof router.__store;
    Object.defineProperty(storeProxy, 'state', { get: () => snapshot });
    storeProxy.get = () => snapshot;

    const routerProxy = Object.create(router) as typeof router;
    Object.defineProperty(routerProxy, '__store', { value: storeProxy });
    frozenRouter.current = routerProxy;
  }

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 h-full w-full"
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 0.8,
      }}
    >
      <RouterContextProvider router={frozenRouter.current}>
        <Outlet />
      </RouterContextProvider>
    </motion.div>
  );
});

export const RouteTransition = () => {
  const matches = useMatches();
  const leafMatchId = matches[matches.length - 1]?.id ?? 'root';

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <AnimatedOutlet key={leafMatchId} />
      </AnimatePresence>
    </div>
  );
};
