import React from 'react';
import { ConfirmationModal } from '../..';

export default {
  title: 'Components/Confirmation modal',
  component: ConfirmationModal
};

const Template = (args) => <ConfirmationModal 
  header={<p>Are you sure?</p>}
  acceptLabel='Confirm'
  cancelLabel='Cancel'
  {...args} 
/>;

export const ButtonTrigger = () => <div className='bg'>
  <Template
    trigger={<button>Click me</button>}
  />
</div>;
