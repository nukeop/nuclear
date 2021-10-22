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
  const {fieldsProps, onSubmit: onFormSubmit, isSubmitting} = useForm({
    onSubmit: (values, {setSubmitting}) => {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        onSubmit(values);
      }, 2500);
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
    onSubmit={onFormSubmit}
    
    header='Sign in'
    signInButtonLabel='Sign in'
    noAccountLabel={'Don\'t have an account?'}
    noAccountLinkLabel='Sign up'
  />;
};
