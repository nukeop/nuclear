import { Meta, StoryObj } from '@storybook/react-vite';
import { AArrowDown, AArrowUp, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

import { Stepper } from '@nuclearplayer/ui';

const offsetFormat = new Intl.NumberFormat('en', {
  signDisplay: 'exceptZero',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
} satisfies Meta<typeof Stepper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LyricsControls: Story = {
  args: {
    decrementIcon: <Minus />,
    incrementIcon: <Plus />,
    onDecrement: () => {},
    onIncrement: () => {},
    labels: { decrement: 'Decrease', increment: 'Increase' },
  },
  render: () => {
    const [offsetMs, setOffsetMs] = useState(0);
    const [sizeIndex, setSizeIndex] = useState(1);
    const changeSize = (step: number) => setSizeIndex((index) => index + step);

    return (
      <div className="flex items-center gap-2 p-4">
        <Stepper
          value={`${offsetFormat.format(offsetMs / 1000)} s`}
          decrementIcon={<Minus className="size-3.5" />}
          incrementIcon={<Plus className="size-3.5" />}
          onDecrement={() => setOffsetMs((offset) => offset - 100)}
          onIncrement={() => setOffsetMs((offset) => offset + 100)}
          labels={{
            decrement: 'Show lyrics earlier',
            increment: 'Show lyrics later',
          }}
        />
        <Stepper
          decrementIcon={<AArrowDown className="size-4" />}
          incrementIcon={<AArrowUp className="size-4" />}
          onDecrement={() => changeSize(-1)}
          onIncrement={() => changeSize(1)}
          isDecrementDisabled={sizeIndex < 1}
          isIncrementDisabled={sizeIndex === 3}
          labels={{ decrement: 'Smaller lyrics', increment: 'Larger lyrics' }}
        />
      </div>
    );
  },
};
