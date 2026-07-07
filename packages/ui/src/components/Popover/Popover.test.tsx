import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from '..';
import { Popover } from './Popover';

describe('Popover', () => {
  it('(Snapshot) renders with all props', async () => {
    render(
      <Popover
        className="border-accent-red"
        anchor="right"
        trigger={<Button>Open Popover</Button>}
      >
        Popover Content
      </Popover>,
    );
    await userEvent.click(screen.getByText('Open Popover'));
    await screen.findByText('Popover Content');
    expect(document.body).toMatchSnapshot();
  });

  it('(Snapshot) renders with backdrop', async () => {
    render(
      <Popover trigger={<Button>Open Popover</Button>} backdrop>
        Popover Content
      </Popover>,
    );
    await userEvent.click(screen.getByText('Open Popover'));
    await screen.findByText('Popover Content');
    expect(document.body).toMatchSnapshot();
  });

  it('(Snapshot) renders menu with items', async () => {
    render(
      <Popover trigger={<Button>Open</Button>} anchor="bottom">
        <Popover.Menu>
          <Popover.Item>Action One</Popover.Item>
          <Popover.Item>Action Two</Popover.Item>
          <Popover.Item intent="danger">Delete</Popover.Item>
        </Popover.Menu>
      </Popover>,
    );
    await userEvent.click(screen.getByText('Open'));
    await screen.findByText('Action One');
    expect(document.body).toMatchSnapshot();
  });

  it('(Snapshot) renders menu with a section and a footer', async () => {
    render(
      <Popover trigger={<Button>Open</Button>} anchor="bottom">
        <Popover.Menu>
          <Popover.Section label="Recent">
            <Popover.Item>Action One</Popover.Item>
            <Popover.Item>Action Two</Popover.Item>
          </Popover.Section>
          <Popover.Footer>
            <Popover.Item intent="danger" align="center">
              Clear
            </Popover.Item>
          </Popover.Footer>
        </Popover.Menu>
      </Popover>,
    );
    await userEvent.click(screen.getByText('Open'));
    await screen.findByText('Action One');
    expect(document.body).toMatchSnapshot();
  });

  it('calls onClick when a menu item is clicked', async () => {
    const handleClick = vi.fn();
    render(
      <Popover trigger={<Button>Open</Button>} anchor="bottom">
        <Popover.Menu>
          <Popover.Item onClick={handleClick}>Action</Popover.Item>
        </Popover.Menu>
      </Popover>,
    );
    await userEvent.click(screen.getByText('Open'));
    await userEvent.click(screen.getByText('Action'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
