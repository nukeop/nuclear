import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { cn } from '../../utils';

export type ScrollableAreaProps = {
  children: ReactNode;
  className?: string;
  fadeScrollbars?: boolean;
  autoHideDelay?: number; // ms, default 1000
  'data-testid'?: string;
};

type ScrollMetrics = {
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
};

const initialMetrics: ScrollMetrics = {
  scrollTop: 0,
  scrollLeft: 0,
  scrollHeight: 0,
  scrollWidth: 0,
  clientHeight: 0,
  clientWidth: 0,
};

function useScrollMetrics(fadeScrollbars: boolean, autoHideDelay: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<ScrollMetrics>(initialMetrics);
  const [isScrolling, setIsScrolling] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const rafRef = useRef<number>();

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    setMetrics({
      scrollTop: el.scrollTop,
      scrollLeft: el.scrollLeft,
      scrollHeight: el.scrollHeight,
      scrollWidth: el.scrollWidth,
      clientHeight: el.clientHeight,
      clientWidth: el.clientWidth,
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      update();
      if (fadeScrollbars) {
        setIsScrolling(true);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(
          () => setIsScrolling(false),
          autoHideDelay,
        );
      }
    });
  }, [fadeScrollbars, autoHideDelay, update]);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    // initial
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [update]);

  return { ref, metrics, isScrolling, handleScroll };
}

// Scrollbar (track + thumb)
interface BarProps {
  orientation: 'vertical' | 'horizontal';
  metrics: ScrollMetrics;
  containerRef: React.RefObject<HTMLDivElement>;
  fadeScrollbars: boolean;
  isScrolling: boolean;
}

const Scrollbar: FC<BarProps> = ({
  orientation,
  metrics,
  containerRef,
  fadeScrollbars,
  isScrolling,
}) => {
  const {
    scrollTop,
    scrollLeft,
    scrollHeight,
    scrollWidth,
    clientHeight,
    clientWidth,
  } = metrics;
  const vertical = orientation === 'vertical';
  const contentExtent = vertical ? scrollHeight : scrollWidth;
  const viewportExtent = vertical ? clientHeight : clientWidth;
  const scrollPos = vertical ? scrollTop : scrollLeft;

  const needs = contentExtent > viewportExtent;
  const [isDragging, setIsDragging] = useState(false);

  const { thumbSize, thumbOffset } = useMemo(() => {
    if (!needs || viewportExtent === 0 || contentExtent <= viewportExtent) {
      return { thumbSize: 0, thumbOffset: 0 };
    }
    const trackSize = viewportExtent; // we size track to viewport extent
    const size = Math.max(20, (viewportExtent / contentExtent) * trackSize);
    const maxScroll = contentExtent - viewportExtent;
    const ratio = maxScroll === 0 ? 0 : scrollPos / maxScroll;
    const offset = ratio * (trackSize - size);
    return { thumbSize: size, thumbOffset: offset };
  }, [needs, viewportExtent, contentExtent, scrollPos]);

  const show = needs && (!fadeScrollbars || isScrolling || isDragging);

  const onTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (!needs || !containerRef.current) {
        return;
      }
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const clickPos = vertical ? e.clientY - rect.top : e.clientX - rect.left;
      const trackSize = vertical ? rect.height : rect.width;
      const maxScroll = contentExtent - viewportExtent;
      const ratio = trackSize - thumbSize <= 0 ? 0 : clickPos / trackSize;
      const target = ratio * maxScroll;
      if (vertical) {
        containerRef.current.scrollTop = target;
      } else {
        containerRef.current.scrollLeft = target;
      }
    },
    [needs, containerRef, vertical, contentExtent, viewportExtent, thumbSize],
  );

  const onThumbMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) {
        return;
      }
      e.preventDefault();
      setIsDragging(true);
      const startClient = vertical ? e.clientY : e.clientX;
      const startScroll = vertical
        ? containerRef.current.scrollTop
        : containerRef.current.scrollLeft;
      const maxScroll = contentExtent - viewportExtent;
      const trackSize = viewportExtent; // track matches viewport
      const move = (ev: MouseEvent) => {
        if (!containerRef.current) {
          return;
        }
        const currentClient = vertical ? ev.clientY : ev.clientX;
        const deltaClient = currentClient - startClient;
        const scrollDelta =
          trackSize - thumbSize <= 0
            ? 0
            : (deltaClient / (trackSize - thumbSize)) * maxScroll;
        const next = Math.max(
          0,
          Math.min(maxScroll, startScroll + scrollDelta),
        );
        if (vertical) {
          containerRef.current.scrollTop = next;
        } else {
          containerRef.current.scrollLeft = next;
        }
      };
      const up = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },
    [containerRef, vertical, contentExtent, viewportExtent, thumbSize],
  );

  if (!needs) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute flex bg-transparent select-none',
        vertical
          ? 'top-0 right-0 bottom-0 w-3 flex-col items-center'
          : 'right-0 bottom-0 left-0 h-3 flex-row items-center',
      )}
      onClick={onTrackClick}
    >
      <div
        className={cn(
          'bg-foreground/80 hover:bg-foreground cursor-pointer rounded-sm transition-opacity duration-200',
          vertical ? 'w-2' : 'h-2',
          show ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          [vertical ? 'height' : 'width']: `${thumbSize}px`,
          transform: vertical
            ? `translateY(${thumbOffset}px)`
            : `translateX(${thumbOffset}px)`,
        }}
        onMouseDown={onThumbMouseDown}
      />
    </div>
  );
};

export const ScrollableArea: FC<ScrollableAreaProps> = ({
  children,
  className,
  fadeScrollbars = true,
  autoHideDelay = 1000,
  'data-testid': testId,
}) => {
  const { ref, metrics, isScrolling, handleScroll } = useScrollMetrics(
    fadeScrollbars,
    autoHideDelay,
  );

  const needsVertical = metrics.scrollHeight > metrics.clientHeight;
  const needsHorizontal = metrics.scrollWidth > metrics.clientWidth;
  const needsCorner = needsVertical && needsHorizontal;

  return (
    <div
      className={cn('relative h-full w-full', className)}
      data-testid={testId}
    >
      <div
        ref={ref}
        className="scrollbar-hide flex h-full w-full flex-col overflow-auto"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>

      <Scrollbar
        orientation="vertical"
        metrics={metrics}
        containerRef={ref}
        fadeScrollbars={fadeScrollbars}
        isScrolling={isScrolling}
      />
      <Scrollbar
        orientation="horizontal"
        metrics={metrics}
        containerRef={ref}
        fadeScrollbars={fadeScrollbars}
        isScrolling={isScrolling}
      />
      {needsCorner && (
        <div className="absolute right-0 bottom-0 h-3 w-3 bg-transparent" />
      )}
    </div>
  );
};
