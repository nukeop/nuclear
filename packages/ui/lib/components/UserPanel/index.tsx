import React from 'react';

import UserPanelSignedIn, { UserPanelSignedInProps } from './UserPanelSignedIn';
import UserPanelSignedOut, { UserPanelSignedOutProps } from './UserPanelSignedOut';

export type UserPanelProps = UserPanelSignedInProps & UserPanelSignedOutProps;

const UserPanel: React.FC<UserPanelProps> = (props) => {
  return props.user ? <UserPanelSignedIn {...props} /> : <UserPanelSignedOut {...props} />;
};

export default UserPanel;
