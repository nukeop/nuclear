import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { FC, ReactNode, useState } from 'react';

import { cn } from '../../utils';
import { Button } from '../Button/Button';
import { Tooltip } from '../Tooltip/Tooltip';
import { useSidebarCompact } from './SidebarCompactContext';

type SidebarNavigationCollapsibleProps = {
  children: ReactNode;
  title: string;
  icon: ReactNode;
};

export const SidebarNavigationCollapsible: FC<
  SidebarNavigationCollapsibleProps
> = ({ children, title, icon }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const isCompact = useSidebarCompact();
  const toggle = () => setIsCollapsed((prev) => !prev);

  return (
    <div
      className={cn(
        'mb-4 flex w-full flex-col text-sm',
        'group-data-[compact]/sidebar:mb-2 group-data-[compact]/sidebar:items-center',
      )}
    >
      <Tooltip content={title} side="right" disabled={!isCompact}>
        <Button
          variant="noShadow"
          size="sm"
          className={cn(
            'inline-flex flex-row items-center justify-between',
            isCollapsed && 'border-transparent bg-transparent',
            'group-data-[compact]/sidebar:size-8 group-data-[compact]/sidebar:justify-center group-data-[compact]/sidebar:p-0',
          )}
          onClick={toggle}
        >
          <span className="inline-flex flex-row items-center gap-2">
            {icon}
            <span className="group-data-[compact]/sidebar:hidden">{title}</span>
          </span>
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 90 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="group-data-[compact]/sidebar:hidden"
          >
            <ChevronRight />
          </motion.div>
        </Button>
      </Tooltip>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: 'auto',
              transitionEnd: { overflow: 'visible' },
            }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
            className={cn(
              'border-l-foreground ml-4 flex flex-col gap-4 border-l-2 pt-2',
              'group-data-[compact]/sidebar:ml-0 group-data-[compact]/sidebar:items-center group-data-[compact]/sidebar:gap-1 group-data-[compact]/sidebar:border-l-0 group-data-[compact]/sidebar:pt-1',
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
