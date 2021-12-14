import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { noop } from 'lodash';

import { UserPanel, FullscreenLayer  } from '@nuclear/ui';

import { NuclearSignInFormContainer } from './NuclearSignInFormContainer';
import { NuclearSignUpFormContainer } from './NuclearSignUpFormContainer';
import { nuclearSelectors } from '../../selectors/nuclear';
import { signOutAction } from '../../actions/nuclear/identity';

export const UserPanelContainer: React.FC = () => {
  const { t } = useTranslation('app');
  const dispatch = useDispatch();

  const [isSignUpFormOpen, setSignUpFormOpen] = useState(false);
  const [isSignInFormOpen, setSignInFormOpen] = useState(false);

  const identity = useSelector(nuclearSelectors.identity);

  return <>
    <UserPanel
      user={identity.signedInUser}
      actionsTooltipContent={t('user-panel.actions-tooltip')}
      signUpButtonLabel={t('user-panel.sign-up')}
      onSettingsClick={() => { }}
      onSignUpClick={() => setSignInFormOpen(true)}
      options={[{
        text: t('user-panel.sign-out'),
        value: 'sign-out',
        onClick: () => dispatch(signOutAction())
      }]}
    />
    <FullscreenLayer 
      isOpen={isSignInFormOpen || isSignUpFormOpen}
      onClose={noop}
    />
    <NuclearSignInFormContainer
      isOpen={isSignInFormOpen}
      onClose={() => setSignInFormOpen(false)}
      onSignUpClick={() => {
        setSignInFormOpen(false);
        setSignUpFormOpen(true);
      }}
    />
    <NuclearSignUpFormContainer
      isOpen={isSignUpFormOpen}
      onClose={() => setSignUpFormOpen(false)}
    />
  </>;
};
