import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { clipboard } from 'electron';
import QueuePopup, { QueuePopupProps } from '../../components/PlayQueue/QueuePopup';
import { RootState } from '../../reducers';

type QueuePopupContainerProps = Omit<QueuePopupProps, 'plugins' | 'actions' | 'copyToClipboard'>;

const QueuePopupContainer: React.FC<QueuePopupContainerProps> = (props) => {
  const plugins = useSelector((state: RootState) => state.plugin);

  const copyToClipboard = (text: string) => {
    if (text?.length) {
      clipboard.writeText(text);
    }
  };

  return (
    <QueuePopup 
      plugins={plugins} 
      copyToClipboard={copyToClipboard} 
      {...props} 
    />
  );
};

export default memo(QueuePopupContainer);
