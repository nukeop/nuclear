import React, { useState, useCallback, useEffect } from 'react';
import { Input, Modal, ModalProps } from 'semantic-ui-react';
import Button from '../Button';

interface CoreInputDialogProps {
  initialString: string
  header: React.ReactElement
  placeholder: string
  acceptLabel: string
  cancelLabel: string
  onAccept: (inputString: string) => void
  testIdPrefix?: string
}

interface UncontrolledInputDialogProps extends CoreInputDialogProps {
  trigger: ModalProps['trigger'];
  onClose?: () => void;
}

interface ControlledInputDialogProps extends CoreInputDialogProps {
  isOpen: boolean;
  onOpen?: () => void;
  onClose: () => void;
}

type InputDialogProps = UncontrolledInputDialogProps | ControlledInputDialogProps

const InputDialog: React.VFC<InputDialogProps> = ({
  initialString,
  header,
  placeholder,
  acceptLabel,
  cancelLabel,
  onAccept,
  testIdPrefix = null,
  ...props
}) => {
  const isControlled = 'isOpen' in props;
  const [isOpen, setIsOpen] = useState(false);
  const [inputString, setInputString] = useState(initialString);

  const handleOpen = useCallback(
    () => (isControlled ? props.onOpen() : setIsOpen(true)),
    [isControlled, props]
  );
  const handleClose = useCallback(
    () => {
      if (isControlled) {
        props.onClose();
      } else {
        if (props.onClose) {
          props.onClose();
        }
        setIsOpen(false);
      }
    },
    [isControlled, props]
  );
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

  const onSubmit = useCallback(
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
      {...({ open: isControlled ? props.isOpen: isOpen })}
      {...(isControlled ? {} : { trigger: props.trigger })}
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
          onClick={onSubmit}
          data-testid={testIdPrefix && `${testIdPrefix}-accept`}
        >
          {acceptLabel}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default InputDialog;
