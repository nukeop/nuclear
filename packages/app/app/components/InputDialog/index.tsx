import React, { useState, useCallback, useEffect } from 'react';
import { Input, Modal, ModalProps } from 'semantic-ui-react';
import { Button } from '@nuclear/ui';

type InputDialogProps = {
initialString: string;
trigger: ModalProps['trigger'];
header: React.ReactElement;
placeholder: string;
acceptLabel: string;
cancelLabel: string;
onAccept: (inputString: string) => void;
testIdPrefix?: string;
}

const InputDialog:React.FC<InputDialogProps> = ({ 
  initialString,
  trigger, 
  header, 
  placeholder, 
  acceptLabel, 
  cancelLabel,
  onAccept, 
  testIdPrefix = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputString, setInputString] = useState(initialString);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);
  const handleChange = useCallback(e => setInputString(e.target.value), []);
  const handleKeyPress = useCallback(e => {
    if (e.key === 'Enter'){ 
      setInputString(e.target.value);
      onAccept(inputString);
      handleClose();
    }
  }, [handleClose, inputString, onAccept]);

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
          onKeyPress={handleKeyPress}
          value={inputString}
          data-testid={testIdPrefix && `${testIdPrefix}-input`}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button 
          basic 
          inverted
          color='red' 
          onClick={handleClose}
          data-testid={testIdPrefix && `${testIdPrefix}-cancel`}>
          {cancelLabel}
        </Button>
        <Button 
          color='green'
          onClick={onClick}
          data-testid={testIdPrefix && `${testIdPrefix}-accept`}>
          {acceptLabel}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default InputDialog;
