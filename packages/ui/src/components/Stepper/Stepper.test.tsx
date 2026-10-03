import { render } from '@testing-library/react';
import { Minus, Plus } from 'lucide-react';

import { Stepper } from '.';

describe('Stepper', () => {
  it('(Snapshot) renders with a value', () => {
    const { container } = render(
      <Stepper
        value="+0.3 s"
        decrementIcon={<Minus />}
        incrementIcon={<Plus />}
        onDecrement={() => {}}
        onIncrement={() => {}}
        labels={{ decrement: 'Decrease', increment: 'Increase' }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders without a value, with the decrement button disabled', () => {
    const { container } = render(
      <Stepper
        decrementIcon={<Minus />}
        incrementIcon={<Plus />}
        onDecrement={() => {}}
        onIncrement={() => {}}
        isDecrementDisabled
        labels={{ decrement: 'Decrease', increment: 'Increase' }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
