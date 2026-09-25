import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { StreamVerification } from './StreamVerification';
import type { StreamVerificationLabels } from './types';

const labels: StreamVerificationLabels = {
  unverified: 'Unverified',
  weaklyVerified: 'Weakly verified',
  verified: 'Verified',
  verifiedByUser: 'Verified by you',
  verify: 'Verify',
  unverify: 'Unverify',
  help: 'How stream verification works',
  explanation: 'Explanation of stream verification',
  learnMore: 'Learn more',
};

const defaultProps = {
  onVerify: vi.fn(),
  onUnverify: vi.fn(),
  onLearnMore: vi.fn(),
  labels,
};

describe('StreamVerification', () => {
  it('(Snapshot) renders loading status', () => {
    const { container } = render(
      <StreamVerification {...defaultProps} status="loading" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders unverified status', () => {
    const { container } = render(
      <StreamVerification {...defaultProps} status="unverified" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders weaklyVerified status', () => {
    const { container } = render(
      <StreamVerification {...defaultProps} status="weaklyVerified" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders verified status', () => {
    const { container } = render(
      <StreamVerification {...defaultProps} status="verified" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders verifiedByUser status', () => {
    const { container } = render(
      <StreamVerification {...defaultProps} status="verifiedByUser" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders the explanation', async () => {
    render(<StreamVerification {...defaultProps} status="unverified" />);
    await userEvent.click(
      screen.getByRole('button', { name: 'How stream verification works' }),
    );
    await screen.findByText('Explanation of stream verification');
    expect(document.body).toMatchSnapshot();
  });
});
