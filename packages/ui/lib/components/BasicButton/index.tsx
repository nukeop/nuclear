import React from 'react';
import cx from 'classnames';
import { Button as SemanticButton, ButtonProps } from 'semantic-ui-react';

import common from '../../common.scss';
import styles from './styles.scss';

const BasicButton: React.FC<ButtonProps> = ({ children, className, ...props }) => <SemanticButton
  {...props}
  basic
  className={cx(common.nuclear, styles.basic_button, className)}
>
  {children}
</SemanticButton>;

export default BasicButton;
