import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clipboard } from 'electron';
import * as QueueActions from '../../actions/queue';
import QueuePopup, { QueuePopupProps } from '../../components/PlayQueue/QueuePopup';
import { RootState } from '../../reducers';
import { bindActionCreators } from 'redux';

type QueuePopupContainerProps = Omit<QueuePopupProps, 'plugins' | 'actions' | 'copyToClipboard'>;

const QueuePopupContainer: React.FC<QueuePopupContainerProps> = (props) => {
  const dispatch = useDispatch();
  const plugins = useSelector((state: RootState) => state.plugin);

  const copyToClipboard = (text: string) => {
    if (text?.length) {
      clipboard.writeText(text);
    }
  };

  const actions = React.useMemo(() => bindActionCreators(QueueActions, dispatch), [dispatch]);

  return <QueuePopup plugins={plugins} actions={actions} copyToClipboard={copyToClipboard} {...props} />;
};

export default QueuePopupContainer;
