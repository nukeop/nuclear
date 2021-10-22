import React from 'react';
import cx from 'classnames';
import { FormInput as SUIInput, InputProps as SUIInputProps } from 'semantic-ui-react';

import common from '../../common.scss';
import styles from './styles.scss';
import { FieldsPropsType } from '../../hooks/types';

export type FormInputProps = Omit<SUIInputProps, 'error'> & FieldsPropsType[keyof FieldsPropsType];

const FormInput: React.FC<FormInputProps> = (props) => <SUIInput 
  className={cx(
    common.nuclear,
    styles.input
  )}
  {...props}
  value={props.value as string}
  onChange={e => props.onChange(e.target.value)}
  error={props.error && {
    content: props.error,
    pointing: 'below'
  }}
/>;

export default FormInput;
