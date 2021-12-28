import React from 'react';
import { Form } from 'semantic-ui-react';
import { FormInput } from '../..';

export default {
  title: 'Components/Form Input'
};

export const Empty = () => <div className='bg'>
  <FormInput />
</div>;

export const AsFormField = () => <div className='bg'>
  <Form>
    <Form.Input label='Username' as={FormInput} />
  </Form>
</div>;
