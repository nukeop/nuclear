import React from 'react';
import { useCallback, useState } from 'react';
import { Modal, ModalProps } from 'semantic-ui-react';
import Button from '../Button';

export type ConfirmationModalProps = {
    trigger: ModalProps['trigger'];

    header: React.ReactElement;
    acceptLabel: string;
    cancelLabel: string;
    onAccept: () => void;
    testIdPrefix?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  trigger,

  header,
  acceptLabel,
  cancelLabel,
  onAccept,
  testIdPrefix = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);
  
  return <Modal
    basic
    dimmer='blurring'
    trigger={trigger}
    onClose={handleClose}
    onOpen={handleOpen}
    open={isOpen}
    data-testid={testIdPrefix ? `${testIdPrefix}-modal` : null}
  >
    <Modal.Content>
      {header}
    </Modal.Content>
    <Modal.Actions>
      <Button 
        basic 
        inverted 
        color='red'
        onClick={handleClose}
      >
        {cancelLabel}
      </Button>    
      <Button
        color='green'
        onClick={() => {
          onAccept();
          handleClose();
        }}
      >
        {acceptLabel}
      </Button>
    </Modal.Actions>
  </Modal>;
};

export default ConfirmationModal;
