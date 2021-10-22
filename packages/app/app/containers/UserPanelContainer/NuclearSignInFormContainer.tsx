import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { NuclearSignInForm, useForm } from '@nuclear/ui';
import { FullscreenLayerProps } from '@nuclear/ui/lib/components/FullscreenLayer';
import { NuclearSignInFormProps } from '@nuclear/ui/lib/forms/NuclearSignInForm';

export type NuclearSignInFormContainerProps = FullscreenLayerProps & Pick<NuclearSignInFormProps, 'onSignUpClick'>;

const initialFields = (t: TFunction<'forms'>) => ({
  username: {
    name: 'username',
    label: t('username-label'),
    placeholder: t('username-label')
  },
  password: {
    name: 'password',
    label: t('password-label'),
    placeholder: t('password-label')
  }
});

export const NuclearSignInFormContainer: React.FC<NuclearSignInFormContainerProps> = ({
  isOpen,
  onClose,
  onSignUpClick
}) => {
  const { t } = useTranslation('forms', { keyPrefix: 'nuclear-sign-in' });
  const { fieldsProps, onSubmit } = useForm({
    initialFields: initialFields(t),
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true);
      // console.log(values);
      setSubmitting(false);
    }
  });

  return <NuclearSignInForm
    isOpen={isOpen}
    onClose={onClose}
    onSignUpClick={onSignUpClick}
    onSubmit={onSubmit}
    fieldsProps={fieldsProps}

    header={t('header')}
    signInButtonLabel={t('sign-in-button')}
    noAccountLabel={t('no-account-label')}
    noAccountLinkLabel={t('no-account-link')}
  />;
};
