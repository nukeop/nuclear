import React from 'react';
import { useTranslation } from 'react-i18next';
import { NuclearSignUpForm } from '@nuclear/ui';
import { FullscreenLayerProps } from '@nuclear/ui/lib/components/FullscreenLayer';

export type NuclearSignUpFormContainerProps = FullscreenLayerProps;

export const NuclearSignUpFormContainer: React.FC<NuclearSignUpFormContainerProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation('forms', { keyPrefix: 'nuclear-sign-up' });

  return <NuclearSignUpForm
    isOpen={isOpen}
    onClose={onClose}
    fieldsProps={{}}

    header={t('header')}
    secondaryHeader={t('secondary-header')}
    sideParagraph1={t('side-paragraph-1')}
    sideParagraph2={t('side-paragraph-2')}
    signUpButtonLabel={t('sign-up-button')}
  />;
};
