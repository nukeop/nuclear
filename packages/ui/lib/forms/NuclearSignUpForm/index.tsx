import React from 'react';
import { Header } from 'semantic-ui-react';

import FullscreenForm, { FullscreenFormProps } from '../../components/FullscreenForm';
import { FormSideContent } from '../FormSideContent';
import { FieldsPropsType } from '../../hooks/types';
import { Button, FormInput } from '../..';
import nuclearLogo from '../../../resources/media/logo_full_light.png';
import styles from '../styles.scss';
import common from '../../common.scss';

type NuclearSignUpFormContentProps = {
  fieldsProps: FieldsPropsType;
  signUpButtonLabel: string;
  header: string;
}

type NuclearSignUpFormSideContentProps = {
  secondaryHeader: string;
  sideParagraph1: string;
  sideParagraph2: string;
}

export type NuclearSignUpFormProps = FullscreenFormProps & NuclearSignUpFormContentProps &
  NuclearSignUpFormSideContentProps;

export const NuclearSignUpFormSideContent: React.FC<NuclearSignUpFormSideContentProps> = ({
  secondaryHeader,
  sideParagraph1,
  sideParagraph2
}) => <FormSideContent>
  <img src={nuclearLogo as unknown as string} />
  <Header inverted className={common.nuclear}>
    {secondaryHeader}
  </Header>
  <p>
    {sideParagraph1}
  </p>

  <p>
    {sideParagraph2}
  </p>
</FormSideContent>;

export const NuclearSignUpFormContent: React.FC<NuclearSignUpFormProps> = ({
  header,
  fieldsProps,
  signUpButtonLabel
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
    {...fieldsProps.email}
  />
  <FormInput
    type='password'
    {...fieldsProps.password}
  />
  <div className={styles.buttons_row}>
    <span />
    <Button
      color='pink'
      type='submit'
    >
      {signUpButtonLabel}
    </Button>
  </div>
</>;

export const NuclearSignUpForm: React.FC<NuclearSignUpFormProps> = (props) => <FullscreenForm {...props}
  sideContent={<NuclearSignUpFormSideContent {...props} />}
>
  <NuclearSignUpFormContent {...props} />
</FullscreenForm>;
