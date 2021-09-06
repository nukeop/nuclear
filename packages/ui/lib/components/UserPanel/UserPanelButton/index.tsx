import React from 'react';
import cx from 'classnames';
import {
  Button as SUIButton,
  ButtonProps as SUIButtonProps
} from 'semantic-ui-react';

import Tooltip, { TooltipProps } from '../../Tooltip';
import common from '../../../common.scss';
import styles from './styles.scss';

export type UserPanelButtonProps = SUIButtonProps & {
    icon: SUIButtonProps['icon'];
    tooltipContent: TooltipProps['content'];
}

const UserPanelButton: React.FC<UserPanelButtonProps> = ({
  className,
  tooltipContent,
  ...rest
}) => <Tooltip
  content={tooltipContent}
  position='top center'
  trigger={
    <SUIButton
      className={cx(
        common.nuclear,
        styles.user_panel_button,
        className
      )}
      {...rest}
    />
  }
/>;

export default UserPanelButton;
