import React, { useState, useCallback, useEffect } from 'react';
import { Button, Input, Modal, ModalProps } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { WebviewTag } from 'electron';

type PlayListDialogProps = {
  initialString: string;
  trigger: ModalProps['trigger'];
  header: React.ReactElement;
  placeholder: string;
  accept: string;
  onAccept: (webview: WebviewTag, handleClose: () => void) => void;
  testIdPrefix?: string;
}

const PlayListDialog: React.FC<PlayListDialogProps> = ({
  initialString,
  trigger,
  header,
  placeholder,
  accept,
  onAccept,
  testIdPrefix = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayView, setDisplay] = useState(false);
  const [inputString, setInputString] = useState(initialString);
  const { t } = useTranslation('input-dialog');

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);
  const handleChange = useCallback(e => setInputString(e.target.value), []);
  const onClick = useCallback(() => {
    // setInputString(e.target.value);
    setDisplay(true);
  }, []);

  const webviewRef = useCallback((w: WebviewTag) => {
    if (w !== null) {
      onAccept(w, handleClose);
    }
  }, [handleClose, onAccept]);

  useEffect(() => {
    setInputString(initialString);
  }, [initialString]);

  return (
    <Modal
      basic
      closeIcon
      dimmer='blurring'
      trigger={trigger}
      onClose={handleClose}
      onOpen={handleOpen}
      open={isOpen}
    >
      <Modal.Content>
        {!displayView && header}
        {!displayView && <Input
          fluid
          inverted
          ref={input => {
            input && input.focus();
          }}
          placeholder={placeholder}
          onChange={handleChange}
          value={inputString}
          data-testid={testIdPrefix && `${testIdPrefix}-input`}
        />}
        {displayView && <webview
          ref={webviewRef}
          src={inputString}
          data-testid={testIdPrefix && `${testIdPrefix}-webview`}
          webpreferences='nodeIntegration=yes,javascript=yes,contextIsolation=no'
          useragent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.175 Safari/537.36'
          style={{ width: '500px', height: '500px' }}
        />}
      </Modal.Content>
      <Modal.Actions>
        {!displayView && <>
          <Button
            basic color='red' inverted
            onClick={handleClose}
            data-testid={testIdPrefix && `${testIdPrefix}-cancel`}>
            {t('cancel')}
          </Button>
          <Button color='green' inverted
            onClick={onClick}
            data-testid={testIdPrefix && `${testIdPrefix}-accept`}>
            {accept}
          </Button>
        </>
        }
      </Modal.Actions>
    </Modal>
  );
};

export default PlayListDialog;
