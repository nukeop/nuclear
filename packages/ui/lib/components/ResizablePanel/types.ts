type ResizablePanelClasses = {
    root: string;
    content: string;
}

export type ResizablePanelProps = {
  classes?: Partial<ResizablePanelClasses>;
  width: number;
  onSetWidth?: (width: number) => void;
  isCollapsed?: boolean;
  collapsedWidth: number;
  right?: boolean;
};
