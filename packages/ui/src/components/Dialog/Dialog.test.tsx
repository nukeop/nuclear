import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { Dialog } from '.';
import { DialogWrapper } from '../../test/DialogWrapper';

const StatefulDialog = ({ defaultOpen = false }: { defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Playlist"
        description="This action cannot be undone."
        actions={
          <>
            <Dialog.Close>Cancel</Dialog.Close>
            <button>Delete</button>
          </>
        }
      />
    </>
  );
};

describe('Dialog', () => {
  it('(Snapshot) renders open dialog', () => {
    render(
      <Dialog
        isOpen
        onClose={vi.fn()}
        title="Confirm"
        description="Are you sure?"
        actions={<button>OK</button>}
      />,
    );
    expect(DialogWrapper.panel).toMatchSnapshot();
  });

  it('displays title and description when open', () => {
    render(
      <Dialog
        isOpen
        onClose={vi.fn()}
        title="Create Playlist"
        description="Give your playlist a name."
        actions={<button>Create</button>}
      />,
    );
    expect(DialogWrapper.getByText('Create Playlist')).toBeInTheDocument();
    expect(
      DialogWrapper.getByText('Give your playlist a name.'),
    ).toBeInTheDocument();
  });

  it('closes when the cancel button is clicked', async () => {
    render(<StatefulDialog defaultOpen />);
    await DialogWrapper.cancelButton.click();
    expect(DialogWrapper.isOpen()).toBe(false);
  });

  it('calls onClose when the cancel button is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Dialog
        isOpen
        onClose={onClose}
        title="Test"
        description="Test"
        actions={<Dialog.Close>Cancel</Dialog.Close>}
      />,
    );
    await DialogWrapper.cancelButton.click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the X button is clicked', async () => {
    const onClose = vi.fn();
    render(<Dialog isOpen onClose={onClose} title="Test" description="Test" />);
    await DialogWrapper.xButton.click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when clicking outside the panel', async () => {
    render(<StatefulDialog defaultOpen />);
    await DialogWrapper.backdrop.click();
    expect(DialogWrapper.isOpen()).toBe(false);
  });

  it('stays open when clicking inside the panel', async () => {
    const user = userEvent.setup();
    render(<StatefulDialog defaultOpen />);
    await user.click(DialogWrapper.getByText('This action cannot be undone.'));
    expect(DialogWrapper.isOpen()).toBe(true);
  });

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(<StatefulDialog defaultOpen />);
    expect(DialogWrapper.isOpen()).toBe(true);
    await user.keyboard('{Escape}');
    expect(DialogWrapper.isOpen()).toBe(false);
  });

  it('opens and closes via external state', async () => {
    const user = userEvent.setup();
    render(<StatefulDialog />);

    expect(DialogWrapper.isOpen()).toBe(false);
    await user.click(screen.getByText('Open'));
    expect(DialogWrapper.isOpen()).toBe(true);
  });
});
