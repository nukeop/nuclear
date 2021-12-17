import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { SignInResponseBody, SignUpRequestBody, SignUpResponseBody } from '@nuclear/core/src/rest/Nuclear/Identity.types';
import { NuclearSignUpForm, useForm } from '@nuclear/ui';
import { FullscreenLayerProps } from '@nuclear/ui/lib/components/FullscreenLayer';

import { signInAction, signUpAction } from '../../actions/nuclear/identity';
import { useDispatch, useSelector } from 'react-redux';
import { settingsSelector } from '../../selectors/settings';
import { NuclearIdentityService } from '@nuclear/core/src/rest/Nuclear/Identity';
import { ErrorBody, isErrorBody } from '@nuclear/core/src/rest/Nuclear/types';

export type NuclearSignUpFormContainerProps = FullscreenLayerProps;

const initialFields = (t: TFunction<'forms'>) => ({
  username: {
    name: 'username',
    label: t('username-label'),
    placeholder: t('username-label')
  },
  email: {
    name: 'email',
    label: t('email-label'),
    placeholder: t('email-label')
  },
  password: {
    name: 'password',
    label: t('password-label'),
    placeholder: t('password-label')
  }
});

const validationSchema = (t: TFunction<'forms'>) => Yup.object({
  username: Yup.string().min(4, t('validation.username.length')).required(t('validation.username.required')),
  email: Yup.string().email(t('validation.email.invalid')),
  password: Yup.string().min(6, t('validation.password.length')).required(t('validation.password.required'))
});

export const NuclearSignUpFormContainer: React.FC<NuclearSignUpFormContainerProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation('forms', { keyPrefix: 'nuclear-sign-up' });

  const dispatch = useDispatch();
  const settings = useSelector(settingsSelector);

  const formProps = useForm<SignUpRequestBody>({
    initialFields: initialFields(t),
    validationSchema: validationSchema(t),
    onSubmit: async (values, { setSubmitting, setStatus, setErrors }) => {
      setSubmitting(true);
      dispatch(signUpAction.request());
      const service = new NuclearIdentityService(settings.nuclearIdentityServiceUrl);

      try {
        const result = await service.signUp(values);
        if (result.ok) {
          dispatch(signUpAction.success(result.body as SignUpResponseBody));
          const signInResult = await service.signIn(values);
          dispatch(signInAction.success(signInResult.body as SignInResponseBody));
          onClose();
        } else {
          if (isErrorBody(result.body)) {
            setErrors(Object.fromEntries(result.body.errors.map((error) => [error.path, error.message])));
          }
          dispatch(signUpAction.failure(result.body as ErrorBody));
        }
      } catch (e) {
        setStatus({
          type: 'error',
          content: e.message
        });
        dispatch(signUpAction.failure(e));
      } finally {
        setSubmitting(false);
      }
    }
  });

  return <NuclearSignUpForm
    isOpen={isOpen}
    onClose={onClose}
    message={formProps.status}
    {...formProps}

    header={t('header')}
    secondaryHeader={t('secondary-header')}
    sideParagraph1={t('side-paragraph-1')}
    sideParagraph2={t('side-paragraph-2')}
    signUpButtonLabel={t('sign-up-button')}
  />;
};

