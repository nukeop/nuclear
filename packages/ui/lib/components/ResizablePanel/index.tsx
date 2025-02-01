import React from 'react';
import cx from 'classnames';
import { Resizable } from 'react-resizable';

import ResizeHandle from '../ResizeHandle';
import { ResizablePanelProps } from './types';
import styles from './styles.scss';

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  classes,
  width,
  onSetWidth,
  isCollapsed,
  collapsedWidth
}) => <Resizable
  height={1}
  width={width}
  onResize={(event, { size }) => {
    onSetWidth(size.width);
  }}
  handle={<ResizeHandle classes={{ root: styles.resizable_panel_resize_handle }} vertical />}
>
  <div
    className={cx(styles.resizable_panel, classes?.root)}
    style={{ width: `${isCollapsed ? collapsedWidth : width}px` }}
  >
    <div className={cx(styles.content, classes?.content)}>
      {children}
    </div>
  </div>
</Resizable>;

export default ResizablePanel;
