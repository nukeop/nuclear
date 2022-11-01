import React, { useState } from 'react';
import { InputDialog } from '../..';

export default {
  title: 'Components/Input Dialog'
};

export const Uncontrolled = () => (
  <div >
    <InputDialog
      acceptLabel='Accept'
      cancelLabel='Cancel'
      header={<h4>Input label:</h4>}
      placeholder='placeholder'
      initialString=''
      onAccept={(input) => {
        alert(input);
      }}
      trigger={<button>Open dialog</button>}
    />
  </div>
);

export const Controlled = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div >
      <button onClick={() => setIsOpen(true)}>Open dialog</button>
      <InputDialog
        acceptLabel='Accept'
        cancelLabel='Cancel'
        header={<h4>Input label:</h4>}
        placeholder='placeholder'
        initialString=''
        onAccept={(input) => {
          alert(input);
        }}
        isOpen={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};
