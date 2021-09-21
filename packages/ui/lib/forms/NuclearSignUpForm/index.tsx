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
}

type NuclearSignUpFormSideContentProps = {
header: string;
sideParagraph1: string;
sideParagraph2: string;
}

export type NuclearSignUpFormProps = FullscreenFormProps & NuclearSignUpFormContentProps &
NuclearSignUpFormSideContentProps;

export const NuclearSignUpFormSideContent: React.FC<NuclearSignUpFormSideContentProps> = ({
  header,
  sideParagraph1,
  sideParagraph2
}) => <FormSideContent>
  <img src={nuclearLogo as unknown as string}/>
  <Header inverted className={common.nuclear}>
    {header}
  </Header>
  <p>
    {sideParagraph1}
  </p>

  <p>
    {sideParagraph2}
  </p>
</FormSideContent>;

export const NuclearSignUpFormContent: React.FC<NuclearSignUpFormProps> = ({
  fieldsProps,
  signUpButtonLabel
}) => <>
  <Header 
    as='h1' 
    inverted
    className={styles.form_header}
  >
    Sign up
  </Header>
  <FormInput 
    {...fieldsProps.username}
  />
  <FormInput 
    {...fieldsProps.email}
  />
  <FormInput 
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
