import React from 'react';

import { NuclearSignInForm } from '../..';
import { useForm } from '../../lib';

export default {
  title: 'Forms/Nuclear Sign In Form',
  argTypes: {
    onSubmitAction: { action: 'Signed in' },
    onSignUpClick: { action: 'Sign up clicked' }
  }
};

export const Empty = ({ onSubmitAction, onSignUpClick }) => {
  const {fieldsProps, onSubmit, isSubmitting} = useForm({
    onSubmit: (values, {setSubmitting}) => {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        onSubmitAction(values);
      }, 1000);
    },
    initialFields: {
      username: {
        name: 'username',
        label: 'Username',
        placeholder: 'Username'
      },
      password: {
        name: 'password',
        label: 'Password',
        placeholder: 'Password'
      }
    }
  });

  return <NuclearSignInForm
    isOpen
    isSubmitting={isSubmitting}
    fieldsProps={fieldsProps}
    onSubmit={onSubmit}
    onSignUpClick={onSignUpClick}
    
    header='Sign in'
    signInButtonLabel='Sign in'
    noAccountLabel={'Don\'t have an account?'}
    noAccountLinkLabel='Sign up'
  />;
};
