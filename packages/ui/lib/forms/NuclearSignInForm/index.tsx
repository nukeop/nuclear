import React from 'react';
import { Header } from 'semantic-ui-react';

import Button from '../../components/Button';
import { FormInput, FullscreenForm } from '../..';
import { FullscreenFormProps } from '../../components/FullscreenForm';
import { FieldsPropsType } from '../../hooks/types';
import styles from '../styles.scss';

type NuclearSignInFormContentProps = {
  header: string;
  signInButtonLabel: string;
  fieldsProps: FieldsPropsType;
  noAccountLabel: string;
  noAccountLinkLabel: string;

  onSignUpClick?: React.MouseEventHandler;
}

export type NuclearSignInFormProps = FullscreenFormProps &
  NuclearSignInFormContentProps;

export const NuclearSignInFormContent: React.FC<NuclearSignInFormProps> = ({
  header,
  signInButtonLabel,
  noAccountLabel,
  noAccountLinkLabel,
  onSignUpClick,
  fieldsProps
}) => <>
  <Header
    as='h1'
    inverted
    className={styles.form_header}
  >
    {header}
  </Header>
  <FormInput
    {...fieldsProps.username}
  />
  <FormInput
    {...fieldsProps.password}
    type='password'
  />
  <div className={styles.buttons_row}>
    <span>
      {noAccountLabel}
      <Button
        text
        type='button'
        color='pink'
        onClick={onSignUpClick}
      >
        {noAccountLinkLabel}
      </Button>
    </span>
    <Button
      type='submit'
      color='pink'
    >
      {signInButtonLabel}
    </Button>
  </div>
</>;

export const NuclearSignInForm: React.FC<NuclearSignInFormProps> = (props) => <FullscreenForm
  {...props}
>
  <NuclearSignInFormContent {...props} />
</FullscreenForm>;
