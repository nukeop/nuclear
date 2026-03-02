import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EditableText } from './EditableText';

describe('EditableText', () => {
  it('(Snapshot) renders in display mode', () => {
    const { container } = render(
      <EditableText value="My Playlist" onSave={vi.fn()} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('shows the value as text in display mode', () => {
    const { getByTestId } = render(
      <EditableText
        value="My Playlist"
        onSave={vi.fn()}
        data-testid="editable"
      />,
    );
    expect(getByTestId('editable-display')).toHaveTextContent('My Playlist');
  });
});
