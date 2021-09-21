import React from 'react';
import { NuclearSignUpForm, useForm } from '../..';

export default {
  title: 'Forms/Nuclear Sign Up Form',
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
    }
  });
  return <NuclearSignUpForm
    isOpen
    fieldsProps={fieldsProps}
    onSubmit={onFormSubmit}
    signUpButtonLabel='Sign up'

    header='Sign up to Nuclear Web Services'
    sideParagraph1='NWS enables you to backup your playlists online and share them.'
    sideParagraph2='Providing your email is optional; it will allow you to recover your account if you forget your password.' />;
};
