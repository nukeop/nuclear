import React, { useState } from 'react';
import { UserPanel } from '../..';

import styles from './styles.scss';

export default {
  title: 'Components/User panel',
  argTypes: {
    onSignUpClick: { action: 'Sign up clicked' },
    onSettingsClick: { action: 'Settings clicked' }
  }
};

export const LoggedOut = ({ onSignUpClick }) => (
  <div className={styles.sidebar}>
    <div className='spacer' />
    <UserPanel
      actionsTooltipContent='Settings'
      signUpButtonLabel='Sign up/Sign in'
      onSignUpClick={onSignUpClick}
    />
  </div>
);

export const LoggedIn = ({ onSignUpClick, onSettingsClick }) => (
  <div className={styles.sidebar}>
    <div className='spacer' />
    <UserPanel
      actionsTooltipContent='Settings'
      user={{
        displayName: 'Display name',
        username: 'username'
      }}
      signUpButtonLabel='Sign up'
      onSignUpClick={onSignUpClick}
      onSettingsClick={onSettingsClick}
    />
  </div>
);

export const WithDropdownOptions = ({ onSignUpClick }) => {
  const [isOpen, setOpen] = useState(false);
  return <div className={styles.sidebar}>
    <div className='spacer' />
    <UserPanel
      actionsTooltipContent='Settings'
      user={{
        displayName: 'Display name',
        username: 'username'
      }}
      signUpButtonLabel='Sign up'
      onSignUpClick={onSignUpClick}
      onSettingsClick={() => setOpen(!isOpen)}
      options={[{
        text: 'Option 1',
        value: 'option-1'
      }, {
        text: 'Option 2',
        value: 'option-2'
      }, {
        text: 'Option 3',
        value: 'option-3'
      }]}
    />
  </div>;
};
