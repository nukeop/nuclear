import React from 'react';
import cx from 'classnames';
import { Form, Icon, Message, MessageContent } from 'semantic-ui-react';
import useOutsideClick from 'react-cool-onclickoutside';

import { Box } from '../..';
import FullscreenLayer, { FullscreenLayerProps } from '../FullscreenLayer';
import { UseFormProps } from '../../hooks/useForm';

import common from '../../common.scss';
import styles from './styles.scss';

export type FullscreenFormProps = FullscreenLayerProps & {
  onSubmit?: UseFormProps['onSubmit'];
  isSubmitting?: UseFormProps['isSubmitting'];
  sideContent?: React.ReactNode;
  message?: {
    content: string;
    type: 'success' | 'error';
  };
}

const isError = (message?: FullscreenFormProps['message']) => message && message.type === 'error';
const isSuccess = (message?: FullscreenFormProps['message']) => message && message.type === 'success';

const FullscreenForm: React.FC<FullscreenFormProps> = ({
  children,
  isOpen = false,
  onClose,
  onSubmit,
  isSubmitting,
  sideContent,
  message
}) => {
  const ref = useOutsideClick(onClose);
  return <FullscreenLayer
    isOpen={isOpen}
    onClose={onClose}
  >
    <div className={cx(styles.fullscreen_form_container, common.nuclear)}>

      <Box
        className={styles.fullscreen_form_box}
        ref={ref}
        shadow
      >
        {
          message &&
          <Message
            icon
            error={isError(message)}
            success={isSuccess(message)}
          >
            <Icon
              name={isError(message) ? 'warning sign' : 'checkmark'} />
            <MessageContent>
              {message.content}
            </MessageContent>
          </Message>
        }
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
};

export default FullscreenForm;
