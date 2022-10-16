import React from 'react';
import { InputDialog } from '../..';

export default {
  title: 'Components/Input Dialog'
};

export const Default = () => (
  <div className='bg'>
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
