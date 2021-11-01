import React, { useState } from 'react';
import { UserPanel } from '@nuclear/ui';
import { useTranslation } from 'react-i18next';
import { NuclearSignInFormContainer } from './NuclearSignInFormContainer';
import { NuclearSignUpFormContainer } from './NuclearSignUpFormContainer';
import { useSelector } from 'react-redux';
import { nuclearSelectors } from '../../selectors/nuclear';
import { IdentityStore } from '../../reducers/nuclear/identity';

export const UserPanelContainer: React.FC = () => {
  const { t } = useTranslation('app');

  const [isSignUpFormOpen, setSignUpFormOpen] = useState(false);
  const [isSignInFormOpen, setSignInFormOpen] = useState(false);

  const identity: IdentityStore = useSelector(nuclearSelectors.identity);
  
  return <>
    <UserPanel
      user={identity.signedInUser}
      actionsTooltipContent={t('user-panel-actions-tooltip')}
      signUpButtonLabel={t('user-panel-sign-up')}
      onSettingsClick={() => { }}
      onSignUpClick={() => setSignInFormOpen(true)}
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
