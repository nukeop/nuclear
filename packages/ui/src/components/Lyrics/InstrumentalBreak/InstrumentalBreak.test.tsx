import { render } from '@testing-library/react';

import { InstrumentalBreak } from '.';

describe('InstrumentalBreak', () => {
  it('(Snapshot) renders the dots filled up to the playback position', () => {
    const { container } = render(
      <>
        <InstrumentalBreak startMs={1000} endMs={7000} positionMs={0} />
        <InstrumentalBreak startMs={1000} endMs={7000} positionMs={4000} />
        <InstrumentalBreak startMs={1000} endMs={7000} positionMs={8000} />
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
