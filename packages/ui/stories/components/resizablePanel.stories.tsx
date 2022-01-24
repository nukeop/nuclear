import React, { useCallback } from 'react';

import { ResizablePanel } from '../..';

import styles from './resizablePanel.styles.scss';

export default {
  title: 'Components/ResizablePanel'
};

const useResizablePanel = (initialWidth: number, collapsedWidth: number, collapseThreshold: number) => {
  const [width, setWidth] = React.useState(initialWidth);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const onSetWidth = useCallback((width) => {
    if (!isCollapsed && width < collapseThreshold) {
      setIsCollapsed(true);
      setWidth(collapsedWidth);
    }

    if (isCollapsed && width >= collapseThreshold) {
      setIsCollapsed(false);
      setWidth(collapseThreshold);
    } else {
      setWidth(width);
    }
  }, [collapseThreshold, collapsedWidth, isCollapsed]);

  return {
    width,
    isCollapsed,
    onSetWidth
  };
};

export const Left = () => {

  const {
    width,
    isCollapsed,
    onSetWidth
  } = useResizablePanel(300, 100, 200);

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
