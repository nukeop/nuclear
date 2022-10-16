import React, { useState, useCallback, useEffect } from 'react';
import { Input, Modal, ModalProps } from 'semantic-ui-react';
import Button from '../Button';

type ControlledInputDialogProps = {
  isOpen: boolean
  handleOpen?: () => void
  handleClose: () => void
  onAccept: (inputString: string) => void
  initialString: string
  header: React.ReactElement
  placeholder: string
  acceptLabel: string
  cancelLabel: string
  testIdPrefix?: string
}

const ControlledInputDialog: React.FC<ControlledInputDialogProps> = ({
  isOpen,
  handleOpen,
  handleClose,
  initialString,
  header,
  placeholder,
  acceptLabel,
  cancelLabel,
  onAccept,
  testIdPrefix = null
}) => {
  const [inputString, setInputString] = useState(initialString);

  const handleChange = useCallback((e) => setInputString(e.target.value), []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        setInputString(e.target.value);
        onAccept(inputString);
        handleClose();
      }
    },
    [handleClose, inputString, onAccept]
  );

  const onClick = useCallback(
    (e) => {
      setInputString(e.target.value);
      onAccept(inputString);
      handleClose();
    },
    [handleClose, inputString, onAccept]
  );

  useEffect(() => {
    setInputString(initialString);
  }, [initialString]);

  return (
    <Modal
      basic
      closeIcon
      dimmer='blurring'
      onClose={handleClose}
      onOpen={handleOpen}
      open={isOpen}
    >
      <Modal.Content>
        {header}
        <Input
          fluid
          inverted
          ref={(input) => {
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
          data-testid={testIdPrefix && `${testIdPrefix}-cancel`}
        >
          {cancelLabel}
        </Button>
        <Button
          color='green'
          onClick={onClick}
          data-testid={testIdPrefix && `${testIdPrefix}-accept`}
        >
          {acceptLabel}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ControlledInputDialog;
