/* eslint-disable no-empty */
import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { NuclearSignInForm, useForm } from '@nuclear/ui';
import { FullscreenLayerProps } from '@nuclear/ui/lib/components/FullscreenLayer';
import { NuclearSignInFormProps } from '@nuclear/ui/lib/forms/NuclearSignInForm';
import { useDispatch, useSelector } from 'react-redux';
import { settingsSelector } from '../../selectors/settings';
import { signInAction } from '../../actions/nuclear/identity';
import { NuclearIdentityService } from '@nuclear/core/src/rest/Nuclear/Identity';
import { SignInRequestBody, SignInResponseBody } from '@nuclear/core/src/rest/Nuclear/Identity.types';
import { ErrorBody } from '@nuclear/core/src/rest/Nuclear/types';

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

  const dispatch = useDispatch();
  const settings = useSelector(settingsSelector);

  const formProps = useForm<SignInRequestBody>({
    initialFields: initialFields(t),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setSubmitting(true);
      setStatus(undefined);
      dispatch(signInAction.request());
      const service = new NuclearIdentityService(settings.nuclearIdentityServiceUrl);

      const result = await service.signIn(values);
      if (result.ok) {
        dispatch(signInAction.success(result.body as SignInResponseBody));
        onClose();
      } else {
        setStatus({
          type: 'error',
          content: (result.body as ErrorBody).message
        });
        dispatch(signInAction.failure(result.body as ErrorBody));
      }
      setSubmitting(false);
    }
  });

  return <NuclearSignInForm
    isOpen={isOpen}
    onClose={onClose}
    onSignUpClick={onSignUpClick}
    message={formProps.status}
    {...formProps}

    header={t('header')}
    signInButtonLabel={t('sign-in-button')}
    noAccountLabel={t('no-account-label')}
    noAccountLinkLabel={t('no-account-link')}
  />;
};
