import React from 'react';
import { Header } from 'semantic-ui-react';

import FullscreenForm, { FullscreenFormProps } from '../../components/FullscreenForm';
import { FormSideContent } from '../FormSideContent';
import common from '../../common.scss';
import nuclearLogo from '../../../resources/media/logo_full_light.png';

type NuclearSignUpFormContentProps = {

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

export const NuclearSignUpFormContent: React.FC<NuclearSignUpFormProps> = () => <>
  <Header as='h1' inverted>Sign up</Header>
</>;

export const NuclearSignUpForm: React.FC<NuclearSignUpFormProps> = (props) => <FullscreenForm {...props}
  sideContent={<NuclearSignUpFormSideContent {...props} />}
>
  <NuclearSignUpFormContent {...props} />
</FullscreenForm>;
