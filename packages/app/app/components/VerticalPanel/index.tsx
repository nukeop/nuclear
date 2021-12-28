import React from 'react';

type VerticalPanelProps = {
  className?: string;
}

const VerticalPanel: React.FC<VerticalPanelProps> = ({ className, children }) => (
  <div className={className}>
    {children}
  </div>
);
export default VerticalPanel;
