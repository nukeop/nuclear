import React from 'react';
import { render } from '@testing-library/react';

type AnyProps = {
  [key: string]: any;
}

export const makeSnapshotTest = (
  Component: React.FC,
  props: AnyProps,
  snapshotName?: string
) => {
  describe(snapshotName || `(Snapshot) ${Component.displayName}`, () => {
    it('should render correctly', () => {
      const { asFragment } = render(<Component {...props} />);
      expect(asFragment()).toMatchSnapshot();
    })
  });
}