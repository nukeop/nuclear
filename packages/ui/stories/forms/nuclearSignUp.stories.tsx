import React from 'react';
import { NuclearSignUpForm } from '../..';

export default {
  title: 'Forms/Nuclear Sign Up Form'
};

export const Empty = () => <NuclearSignUpForm
  isOpen
  usernameLabel='Username'
  emailLabel='Email (optional)'
  passwordLabel='Password'
  signUpButtonLabel='Sign up'

  header='Sign up to Nuclear Web Services'
  sideParagraph1='NWS enables you to backup your playlists online and share them.'
  sideParagraph2='Providing your email is optional; it will allow you to recover your account if you forget your password.'
/>;
