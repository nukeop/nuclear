import React, { useEffect, useState } from 'react';
import FontAwesome from 'react-fontawesome';
import { useHistory } from 'react-router';
import { History } from 'history';

import styles from './styles.scss';


const NavButtons: React.FC = () => {
  const history = useHistory() as History & {index: number};

  const [backButtonEnabled, setBackButtonEnabled] = useState(false);
  const [forwardButtonEnabled, setForwardButtonEnabled] = useState(false);

  useEffect(() => {
    setBackButtonEnabled(history.index > 1);
    setForwardButtonEnabled(history.index < (history.length - 1));
  }, [history.index, history.length]);

  return (
    <div className={styles.nav_buttons}>
      <a href='#' onClick={backButtonEnabled ? history.goBack : undefined}
        className={backButtonEnabled ? undefined : 'disable'}>
        <FontAwesome name='chevron-left'/>
      </a>
      <a href='#' onClick={forwardButtonEnabled ? history.goForward : undefined}
        className={forwardButtonEnabled ? undefined : 'disable'}>
        <FontAwesome name='chevron-right'/>
      </a>
    </div>
  );
};

export default NavButtons;
