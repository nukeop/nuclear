import React from 'react';
import cx from 'classnames';
import { FormInput as SUIInput, InputProps as SUIInputProps } from 'semantic-ui-react';

import common from '../../common.scss';
import styles from './styles.scss';
import { FieldsPropsType } from '../../hooks/types';

export type FormInputProps = Omit<SUIInputProps, 'error'> & Partial<FieldsPropsType[keyof FieldsPropsType]>;

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>((props, ref) => (
  <SUIInput
    className={cx(common.nuclear, styles.input)}
    {...props}
    value={props.value as string}
    onChange={(e) => props.onChange(e.target.value)}
    error={props.error && {
      content: props.error,
      pointing: 'below'
    }}
    input={{ref}}
  />
));
export default FormInput;
