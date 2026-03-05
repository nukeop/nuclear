import { render } from '@testing-library/react';

import { KeyCombo } from '.';

describe('KeyCombo', () => {
  it('(Snapshot) renders single key', () => {
    const { container } = render(<KeyCombo shortcut="space" />);
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders modifier combos', () => {
    const { container } = render(
      <div className="flex flex-col gap-2">
        <KeyCombo shortcut="mod+right" />
        <KeyCombo shortcut="mod+m" />
        <KeyCombo shortcut="mod+," />
        <KeyCombo shortcut="shift+alt+p" />
      </div>,
    );
    expect(container).toMatchSnapshot();
  });
});
