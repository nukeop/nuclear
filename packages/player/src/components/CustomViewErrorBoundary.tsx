import { Component, ReactNode } from 'react';

import { handleCustomViewCrash } from '../services/customViewCrash';
import type { RegisteredCustomView } from '../stores/customViewsStore';

type CustomViewErrorBoundaryProps = {
  registered: RegisteredCustomView;
  children: ReactNode;
};

type CustomViewErrorBoundaryState = {
  crashed: boolean;
};

export class CustomViewErrorBoundary extends Component<
  CustomViewErrorBoundaryProps,
  CustomViewErrorBoundaryState
> {
  state: CustomViewErrorBoundaryState = { crashed: false };

  static getDerivedStateFromError(): CustomViewErrorBoundaryState {
    return { crashed: true };
  }

  componentDidCatch(error: unknown) {
    handleCustomViewCrash(this.props.registered, error);
  }

  render() {
    if (this.state.crashed) {
      return null;
    }
    return this.props.children;
  }
}
