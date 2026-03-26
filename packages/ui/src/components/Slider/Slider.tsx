import type { KeyboardEvent, PropsWithChildren } from 'react';
import { FC, useId, useMemo, useRef, useState } from 'react';

import { cn } from '../../utils';
import { SliderProvider, useSliderContext } from './context';
import { useSliderWheel } from './useSliderWheel';

type SliderProps = {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
  showValue?: boolean;
  showFooter?: boolean;
  startLabel?: string;
  endLabel?: string;
};

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_STEP = 1;

const SliderRoot: FC<
  PropsWithChildren<Omit<SliderProps, 'label' | 'showValue' | 'showFooter'>>
> = ({
  value: valueProp,
  defaultValue,
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  step = DEFAULT_STEP,
  unit,
  onValueChange,
  disabled,
  className,
  children,
}) => {
  const [internal, setInternal] = useState<number | undefined>(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? (valueProp as number) : (internal ?? min);
  const clamp = (n: number) => Math.min(Math.max(n, min), max);
  const emit = (next: number) => {
    const v = clamp(next);
    if (!isControlled) {
      setInternal(v);
    }
    onValueChange?.(v);
  };

  const percentage = useMemo(() => {
    if (max === min) {
      return 0;
    }
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useSliderWheel(wrapperRef, {
    disabled,
    get: () => ({ value, step, min, max }),
    set: (next) => emit(next),
  });

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    const deltas: Record<string, number> = {
      ArrowRight: step,
      ArrowUp: step,
      ArrowLeft: -step,
      ArrowDown: -step,
      PageUp: step * 10,
      PageDown: -step * 10,
    };
    const delta = deltas[e.key];
    if (typeof delta === 'number') {
      e.preventDefault();
      emit(value + delta);
      return;
    }
    if (e.key === 'Home') {
      e.preventDefault();
      emit(min);
      return;
    }
    if (e.key === 'End') {
      e.preventDefault();
      emit(max);
    }
  };

  const inputId = useId();
  const labelId = `${inputId}-label`;

  return (
    <SliderProvider
      value={{
        inputId,
        labelId,
        min,
        max,
        step,
        value,
        unit,
        disabled,
        percentage,
        emit,
        onKeyDown,
      }}
    >
      <div
        ref={wrapperRef}
        className={cn('flex w-full flex-col gap-2', className)}
      >
        {children}
      </div>
    </SliderProvider>
  );
};

export const SliderHeader: FC<{ label?: string; showValue?: boolean }> = ({
  label,
  showValue = true,
}) => {
  const { inputId, labelId, unit, value } = useSliderContext();
  return (
    <div className="flex w-full items-center justify-between text-sm">
      <label
        id={labelId}
        className="text-foreground font-semibold"
        htmlFor={inputId}
      >
        {label}
      </label>
      {showValue && (
        <span className="text-foreground-secondary">
          {value}
          {unit ? ` ${unit}` : ''}
        </span>
      )}
    </div>
  );
};

export const SliderTrack: FC = () => {
  const { percentage } = useSliderContext();
  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
      <div className="border-border bg-background-input relative h-3 w-full rounded-md border-(length:--border-width)">
        <div
          className="bg-primary absolute top-0 left-0 h-full rounded-l"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="border-border absolute top-1/2 -ml-2 h-5 w-5 -translate-y-1/2 rounded-full border-(length:--border-width) bg-white"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const SliderRangeInput: FC = () => {
  const {
    inputId,
    labelId,
    min,
    max,
    step,
    value,
    unit,
    emit,
    onKeyDown,
    disabled,
  } = useSliderContext();
  return (
    <input
      id={inputId}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => emit(Number(e.target.value))}
      onKeyDown={onKeyDown}
      disabled={disabled}
      aria-labelledby={labelId}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={unit ? `${value} ${unit}` : String(value)}
      className={cn(
        'absolute inset-0 z-[1] h-6 w-full appearance-none opacity-0',
        'cursor-pointer',
      )}
    />
  );
};

export const SliderSurface: FC<PropsWithChildren> = ({ children }) => (
  <div className="relative h-6 w-full overscroll-contain">{children}</div>
);

export const SliderFooter: FC<{
  startLabel?: string;
  endLabel?: string;
}> = ({ startLabel, endLabel }) => {
  const { min, max, unit } = useSliderContext();
  return (
    <div className="text-foreground-secondary flex w-full justify-between text-xs">
      <span>{startLabel ?? `${min}${unit ? ` ${unit}` : ''}`}</span>
      <span>{endLabel ?? `${max}${unit ? ` ${unit}` : ''}`}</span>
    </div>
  );
};

type SliderComponent = FC<PropsWithChildren<SliderProps>> & {
  Header: typeof SliderHeader;
  Surface: typeof SliderSurface;
  Track: typeof SliderTrack;
  RangeInput: typeof SliderRangeInput;
  Footer: typeof SliderFooter;
};

const SliderImpl: FC<PropsWithChildren<SliderProps>> = ({
  label,
  description,
  showValue = true,
  showFooter = true,
  startLabel,
  endLabel,
  className,
  children,
  ...rest
}) => {
  const hasCustomChildren = !!children;
  return (
    <SliderRoot className={className} {...rest}>
      {hasCustomChildren ? (
        children
      ) : (
        <>
          {(label || showValue) && (
            <SliderHeader label={label} showValue={showValue} />
          )}
          {description && (
            <p className="text-foreground-secondary text-xs">{description}</p>
          )}
          <SliderSurface>
            <SliderTrack />
            <SliderRangeInput />
          </SliderSurface>
          {showFooter && (
            <SliderFooter startLabel={startLabel} endLabel={endLabel} />
          )}
        </>
      )}
    </SliderRoot>
  );
};

export const Slider = SliderImpl as SliderComponent;
Slider.Header = SliderHeader;
Slider.Surface = SliderSurface;
Slider.Track = SliderTrack;
Slider.RangeInput = SliderRangeInput;
Slider.Footer = SliderFooter;
