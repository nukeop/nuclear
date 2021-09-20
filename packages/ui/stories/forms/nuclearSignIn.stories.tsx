import React from 'react';
import { NuclearSignInForm } from '../..';
import { useForm } from '../../lib';

export default {
  title: 'Forms/Nuclear Sign In Form',
  argTypes: {
    onSubmit: { action: 'Signed in' }
  }
};

export const Empty = ({ onSubmit }) => {
  const {fieldsProps, onSubmit: onFormSubmit} = useForm({
    onSubmit,
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
    signInButtonLabel='Sign in'
    noAccountLabel={'Don\'t have an account?'}
    noAccountLinkLabel='Sign up'

    onSubmit={onFormSubmit}
    fieldsProps={fieldsProps}
  />;
};
