import {
  Outlet,
  RouterContextProvider,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';
import { AnimatePresence, motion, useIsPresent } from 'motion/react';
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

const createFrozenStore = <TValue,>(value: TValue) => ({
  get: () => value,
  subscribe: () => ({ unsubscribe: () => {} }),
});

type RouterInstance = ReturnType<typeof useRouter>;

const createFrozenRouter = (
  router: RouterInstance,
  snapshot: RouterInstance['state'],
): RouterInstance => {
  const byRoute = new Map<string, ReturnType<typeof createFrozenStore>>(
    snapshot.matches.map((match) => [match.routeId, createFrozenStore(match)]),
  );

  const stores = Object.create(router.stores) as typeof router.stores;
  Object.defineProperties(stores, {
    ids: {
      value: createFrozenStore(snapshot.matches.map((match) => match.routeId)),
    },
    getMatchStore: {
      value: (routeId: string) =>
        byRoute.get(routeId) ?? createFrozenStore(undefined),
    },
    location: { value: createFrozenStore(snapshot.location) },
    __store: { value: createFrozenStore(snapshot) },
  });

  const frozenRouter = Object.create(router) as RouterInstance;
  Object.defineProperty(frozenRouter, 'stores', { value: stores });
  return frozenRouter;
};

const AnimatedOutlet = forwardRef<HTMLDivElement>((_props, ref) => {
  const router = useRouter();
  const isPresent = useIsPresent();
  const frozenState = useRef(router.state);
  const frozenRouter = useRef(router);

  if (isPresent) {
    frozenState.current = router.state;
    frozenRouter.current = router;
  } else if (frozenRouter.current === router) {
    frozenRouter.current = createFrozenRouter(router, frozenState.current);
  }

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 h-full w-full will-change-[transform,filter]"
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
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <AnimatedOutlet key={pathname} />
      </AnimatePresence>
    </div>
  );
};
