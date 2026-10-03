import { ArrowDown, ArrowUp } from 'lucide-react';
import { FC, RefObject } from 'react';

import { Button } from '../../Button';
import { useIsActiveLineAbove } from './useIsActiveLineAbove';

type CurrentLinePillProps = {
  viewportRef: RefObject<HTMLDivElement>;
  activeLineRef: RefObject<HTMLButtonElement>;
  activeLineIndex: number;
  label: string;
  onClick: () => void;
};

export const CurrentLinePill: FC<CurrentLinePillProps> = ({
  viewportRef,
  activeLineRef,
  activeLineIndex,
  label,
  onClick,
}) => {
  const isActiveLineAbove = useIsActiveLineAbove(
    viewportRef,
    activeLineRef,
    activeLineIndex,
  );

  return (
    <div className="pointer-events-none sticky bottom-4 flex shrink-0 justify-center font-sans tracking-normal font-stretch-normal">
      <Button
        size="sm"
        onClick={onClick}
        className="pointer-events-auto gap-2 text-sm font-bold"
      >
        {isActiveLineAbove && <ArrowUp className="size-4" />}
        {!isActiveLineAbove && <ArrowDown className="size-4" />}
        {label}
      </Button>
    </div>
  );
};
