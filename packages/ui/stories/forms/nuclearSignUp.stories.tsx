import React from 'react';
import * as Yup from 'yup';

import { NuclearSignUpForm, useForm } from '../..';

export default {
  title: 'Forms/Nuclear Sign Up Form',
  argTypes: {
    onSubmit: { action: 'Signed in' }
  }
};

export const Empty = ({ onSubmit }) => {
  const { fieldsProps, onSubmit: onFormSubmit, isSubmitting } = useForm({
    onSubmit: (values, { setSubmitting }) => {
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
      email: {
        name: 'email',
        label: 'Email',
        placeholder: 'Email'
      },
      password: {
        name: 'password',
        label: 'Password',
        placeholder: 'Password'
      }
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Email must be a valid email'),
      password: Yup.string().required('Password is required')
    })
  });
  return <NuclearSignUpForm
    isOpen
    isSubmitting={isSubmitting}
    fieldsProps={fieldsProps}
    onSubmit={onFormSubmit}
    signUpButtonLabel='Sign up'

    header='Sign up'
    secondaryHeader='Sign up to Nuclear Web Services'
    sideParagraph1='NWS enables you to backup your playlists online and share them.'
    sideParagraph2='Providing your email is optional; it will allow you to recover your account if you forget your password.'
  />;
};
