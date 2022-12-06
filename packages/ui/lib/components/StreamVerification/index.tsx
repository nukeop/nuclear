import React from 'react';
import cx from 'classnames';

import Button from '../Button';
import styles from './styles.scss';
import Tooltip from '../Tooltip';
import { Icon } from 'semantic-ui-react';

export type StreamVerificationProps = {
    status: 'unknown' | 'unverified' | 'weakly_verified' | 'verified' | 'verified_by_user';
    onVerify: () => void;
    onUnverify: () => void;
} & StreamVerificationStrings;

type StreamVerificationStrings = {
    tooltipStrings: {
        [key in StreamVerificationProps['status']]: string;
    };
    streamStatusStrings: {
        [key in StreamVerificationProps['status']]: string;
    };
    textVerify: string;
}

const StreamVerification: React.FC<StreamVerificationProps> = ({
  status,
  onVerify,
  onUnverify, 
  tooltipStrings,
  streamStatusStrings,
  textVerify
}) => {
  return <div className={styles.stream_verification}>
    <Tooltip
      content={tooltipStrings[status]}
      trigger={
        <div className={styles.stream_verification_right}>
          <div
            className={cx(styles.stream_status_icon, styles[status])}
          >
            <Icon name='check circle' />
          </div>
          <div className={styles.stream_status}>
            {streamStatusStrings[status]}
          </div>
        </div>
      }
    />

    <Button
      onClick={status === 'verified_by_user' ? onUnverify : onVerify}
    >
      {textVerify}
    </Button>
  </div>;
};

export default StreamVerification;
