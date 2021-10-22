import React from 'react';
import cx from 'classnames';
import { Form } from 'semantic-ui-react';

import { Box } from '../..';
import FullscreenLayer, { FullscreenLayerProps } from '../FullscreenLayer';
import { UseFormProps } from '../../hooks/useForm';

import common from '../../common.scss';
import styles from './styles.scss';

export type FullscreenFormProps = FullscreenLayerProps & {
  onSubmit?: UseFormProps['onSubmit'];
  isSubmitting?: UseFormProps['isSubmitting'];
  sideContent?: React.ReactNode;
}

const FullscreenForm: React.FC<FullscreenFormProps> = ({
  children,
  isOpen = false,
  onClose,
  onSubmit,
  isSubmitting,
  sideContent
}) => <FullscreenLayer
  isOpen={isOpen}
  onClose={onClose}
>
  <div className={cx(styles.fullscreen_form_container, common.nuclear)}>

    <Box 
      className={styles.fullscreen_form_box}
      shadow
    >
      {sideContent}
      <Form 
        className={styles.fullscreen_form}
        onSubmit={onSubmit}
        loading={isSubmitting}
      >
        {!isSubmitting && children}
      </Form>
    </Box>

  </div>
</FullscreenLayer>;

export default FullscreenForm;
