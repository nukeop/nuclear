import React, { useState } from 'react';
import { UserPanel, NuclearSignUpForm } from '@nuclear/ui';
import { useTranslation } from 'react-i18next';

export const UserPanelContainer: React.FC = () => {
  const { t } = useTranslation('app');
  const [isFormOpen, setFormOpen] = useState(false);

  return <>
    <UserPanel
      actionsTooltipContent={t('user-panel-actions-tooltip')}
      signUpButtonLabel={t('user-panel-sign-up')}
      onSeetingsClick={() => { }}
      onSignUpClick={() => setFormOpen(true)}

    />
    <NuclearSignUpForm
      isOpen={isFormOpen}
      onClose={() => setFormOpen(false)}
    />
  </>;
};
