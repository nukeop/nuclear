import React from 'react';

import styles from './styles.module.scss';

export type FormSideContentProps = {

}

export const FormSideContent: React.FC<FormSideContentProps> = ({
  children
}) => <div className={'nuclear '+styles.form_side_content}>
  {children}
</div>;
