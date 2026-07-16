import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Pagination } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Interactive: Story = {
  render: () => {
    const [manyPagesCurrent, setManyPagesCurrent] = useState(12);
    const [fewPagesCurrent, setFewPagesCurrent] = useState(2);
    const [wideWindowCurrent, setWideWindowCurrent] = useState(10);

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-foreground text-sm font-semibold">Many pages</h3>
          <Pagination
            currentPage={manyPagesCurrent}
            totalPages={24}
            onPageChange={setManyPagesCurrent}
          />
          <p className="text-foreground/60 text-xs">
            Page {manyPagesCurrent} of 24. Ellipses appear on both sides in the
            middle; walk to page 1 or 24 to see the boundary states.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-foreground text-sm font-semibold">Few pages</h3>
          <Pagination
            currentPage={fewPagesCurrent}
            totalPages={5}
            onPageChange={setFewPagesCurrent}
          />
          <p className="text-foreground/60 text-xs">
            All pages fit, so no ellipsis is ever shown.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-foreground text-sm font-semibold">
            Wider sibling window
          </h3>
          <Pagination
            currentPage={wideWindowCurrent}
            totalPages={20}
            siblingCount={2}
            onPageChange={setWideWindowCurrent}
          />
          <p className="text-foreground/60 text-xs">
            siblingCount 2 keeps two neighbors on each side of the current page.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-foreground text-sm font-semibold">Single page</h3>
          <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
          <p className="text-foreground/60 text-xs">
            Renders nothing when there is only one page.
          </p>
        </div>
      </div>
    );
  },
};
