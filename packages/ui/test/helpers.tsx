import React from 'react';
import { render } from '@testing-library/react';

type AnyProps = {
  [key: string]: any;
}

export const makeSnapshotTest = <ComponentProps extends {}>(
  Component: React.ComponentType<ComponentProps>,
  props: Partial<ComponentProps>,
  snapshotName?: string
) => {
  describe(snapshotName || `(Snapshot) ${Component.displayName}`, () => {
    it('should render correctly', () => {
      const { asFragment } = render(<Component {...props as ComponentProps} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
};
