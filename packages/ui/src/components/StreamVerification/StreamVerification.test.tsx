import { render } from '@testing-library/react';
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
};

const defaultProps = {
  onVerify: vi.fn(),
  onUnverify: vi.fn(),
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
});
