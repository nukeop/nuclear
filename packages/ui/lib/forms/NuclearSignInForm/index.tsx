import React from 'react';
import { Header } from 'semantic-ui-react';

import Button from '../../components/Button';
import { FormInput, FullscreenForm } from '../..';
import styles from './styles.scss';
import { FullscreenFormProps } from '../../components/FullscreenForm';
import { FieldsPropsType } from '../../hooks/types';

type NuclearSignInFormContentProps = {
  signInButtonLabel: string;
  fieldsProps: FieldsPropsType;
  noAccountLabel: string;
  noAccountLinkLabel: string;

  onSignUpClick?: React.MouseEventHandler;
}

export type NuclearSignInFormProps = FullscreenFormProps &
  NuclearSignInFormContentProps;

export const NuclearSignInFormContent: React.FC<NuclearSignInFormProps> = ({
  signInButtonLabel,
  noAccountLabel,
  noAccountLinkLabel,
  fieldsProps
}) => <>
  <Header as='h1' inverted>Sign in</Header>
  <FormInput
    {...fieldsProps.username}
  />
  <FormInput
    {...fieldsProps.password}
  />
  <div className={styles.buttons_row}>
    <span>
      {noAccountLabel}
      <a>{noAccountLinkLabel}</a>
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
