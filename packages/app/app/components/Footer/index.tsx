import React from 'react';

//  type declaration as [component name]Props
type FooterProps={
    className: string;
};

//  component is of type React.FC
const Footer: React.FC<FooterProps> = ({className, children}) => {
  return (
    <div className={className}>{children}</div>
  );
};

export default Footer;
