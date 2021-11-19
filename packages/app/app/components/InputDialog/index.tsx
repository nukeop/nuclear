import React, { useState, useCallback, useEffect } from 'react';
import { Button, Input, Modal, ModalProps } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

type InputDialogProps = {
initialString:string;
trigger:ModalProps['trigger'];
header: React.ReactElement;
placeholder:string;
accept:string;
onAccept: (inputString: string) => void;
testIdPrefix:string;

}

const InputDialog:React.FC<InputDialogProps> = ({ 
  initialString,
  trigger, 
  header, 
  placeholder, 
  accept, 
  onAccept, 
  testIdPrefix = null }) => {
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
          data-testid={testIdPrefix && `${testIdPrefix}-input`}
        />
      </Modal.Content>
      <Modal.Actions>
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
      </Modal.Actions>
    </Modal>
  );
};

export default InputDialog;
