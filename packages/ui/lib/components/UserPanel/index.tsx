import React from 'react';
import cx from 'classnames';
import { Dropdown as SUIDropdown } from 'semantic-ui-react';

import styles from './styles.scss';
import common from '../../common.scss';
import UserPanelButton, { UserPanelButtonProps } from './UserPanelButton';
import UsernameContainer from './UsernameContainer';
import Dropdown from '../Dropdown';

type User = {
  username: string;
  displayName: string;
}

type UserPanelProps = {
  user?: User;
  actionsTooltipContent: UserPanelButtonProps['tooltipContent'];
};

const UserPanel: React.FC<UserPanelProps> = ({
  user,
  actionsTooltipContent
}) => {
  return <section className={cx(common.nuclear, styles.user_panel)}>
    <UsernameContainer
      username={user?.username}
      displayName={user?.displayName}
    />
    <Dropdown
      upward
      direction='left'
      trigger={
        <UserPanelButton
          tooltipContent={actionsTooltipContent}
          icon='cog'
        />
      }
      noCaret
      noBorder
    >
      <SUIDropdown.Menu>
        <SUIDropdown.Item>
          Sign up
        </SUIDropdown.Item>
        <SUIDropdown.Item>
          Log out
        </SUIDropdown.Item>
      </SUIDropdown.Menu>
    </Dropdown>
  </section>;
};

export default UserPanel;
