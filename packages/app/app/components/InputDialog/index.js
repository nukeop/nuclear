import React, { useState, useCallback, useEffect } from 'react';
import { Button, Input, Modal } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

const InputDialog = ({ initialString, trigger, header, placeholder, accept, onAccept }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputString, setInputString] = useState(initialString);
  const { t } = useTranslation('input-dialog');

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);
  const handleChange = useCallback(e => setInputString(e.target.value), []);
  const onClick = useCallback(e => {
    setInputString(e.target.value);
    onAccept(inputString);
    handleClose();
  }, [handleClose, inputString, onAccept]);

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
        {header}
        <Input
          fluid
          inverted
          ref={input => {
            input && input.focus();
          }}
          placeholder={placeholder}
          onChange={handleChange}
          value={inputString}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose} basic color='red' inverted>
          {t('cancel')}
        </Button>
        <Button color='green' inverted onClick={onClick}>
          {accept}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default InputDialog;
