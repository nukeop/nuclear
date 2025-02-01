import React, { useCallback, useState } from 'react';

import { ResizablePanel } from '../..';

import styles from './resizablePanel.styles.scss';

export default {
  title: 'Components/ResizablePanel'
};

type UseResizablePanelArgs = {
  initialWidth: number;
  collapsedWidth: number;
  collapseThreshold: number;
  isCollapsed: boolean;
  onCollapse: (isCollapsed: boolean) => void;
};

const useResizablePanel = ({
  initialWidth,
  collapsedWidth,
  collapseThreshold,
  isCollapsed,
  onCollapse
}: UseResizablePanelArgs) => {
  const [width, setWidth] = useState(initialWidth);

  const onSetWidth = useCallback(
    (width) => {
      if (!isCollapsed && width < collapseThreshold) {
        onCollapse(true);
        setWidth(collapsedWidth);
      }

      if (isCollapsed && width >= collapseThreshold) {
        onCollapse(false);
        setWidth(collapseThreshold);
      } else {
        setWidth(width);
      }
    },
    [collapseThreshold, collapsedWidth, isCollapsed, onCollapse]
  );

  return {
    width,
    onSetWidth
  };
};

export const Left = () => {
  const [isCollapsed, onCollapse] = useState(false);
  const {
    width,
    onSetWidth
  } = useResizablePanel({
    initialWidth: 300,
    collapsedWidth: 100,
    collapseThreshold: 200,
    isCollapsed,
    onCollapse
  });

  return <div className='bg'>
    <ResizablePanel
      classes={{ root: styles.resizable_panel_story }}
      width={width}
      onSetWidth={onSetWidth}
      isCollapsed={isCollapsed}
      collapsedWidth={100}
    >
      {
        isCollapsed
          ? 'Collapsed'
          : 'Expanded'
      }
    </ResizablePanel>
  </div>;
};

// Resizing the panel with a handle on the left does not work yet

// export const Right = () => {
//   const {
//     width,
//     isCollapsed,
//     onSetWidth
//   } = useResizablePanel(300, 100, 200);

//   return <div className='bg'
//     style={{
//       display: 'flex',
//       justifyContent: 'flex-end'
//     }}
//   >
//     <ResizablePanel
//       classes={{ root: styles.resizable_panel_story }}
//       width={width}
//       onSetWidth={onSetWidth}
//       isCollapsed={isCollapsed}
//       collapsedWidth={100}
//       right
//     >
//       {
//         isCollapsed
//           ? 'Collapsed'
//           : 'Expanded'
//       }
//     </ResizablePanel>
//   </div>;
// };
