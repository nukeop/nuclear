import React from 'react';
import cx from 'classnames';

import UserPanelButton, { UserPanelButtonProps } from '../UserPanelButton';
import UsernameContainer from '../UsernameContainer';
import { UserPanelProps } from '..';

import styles from '../styles.scss';
import common from '../../../common.scss';

type User = {
  username: string;
  displayName: string;
}

export type UserPanelSignedInProps = {
  user?: User;
  actionsTooltipContent: UserPanelButtonProps['tooltipContent'];
  onSettingsClick?: React.MouseEventHandler;
}

const UserPanelSignedIn: React.FC<UserPanelProps> = ({
  user,
  onSettingsClick,
  actionsTooltipContent
}) => {
  return <section className={cx(common.nuclear, styles.user_panel)}>
    <UsernameContainer
      username={user?.username}
      displayName={user?.displayName}
    />
    <UserPanelButton
      onClick={onSettingsClick}
      tooltipContent={actionsTooltipContent}
      icon='cog'
    />
  </section>;
};

export default UserPanelSignedIn;
