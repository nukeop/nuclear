import React from 'react';
import { makeSnapshotTest } from './helpers';
import { InputDialog } from '..';
import { render } from '@testing-library/react';

describe('(Snapshot) InputDialog - open', () => {
  it('should render correctly', () => {
    render(<InputDialog 
      isOpen
      header={<>Input header</>}
      acceptLabel='Accept'
      cancelLabel='Cancel'
      initialString='Initial string'
      placeholder='Input placeholder'
      onAccept={() => {}}
      onClose={() => {}}
    />);
    // we need to use document.body because the dialog is rendered outside the component fragment
    expect(document.body).toMatchSnapshot(); 
  });
});
