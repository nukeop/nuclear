import { Component, ReactNode } from 'react';

import { handleCustomViewCrash } from '../services/customViewCrash';

type CustomViewErrorBoundaryProps = {
  pluginId: string;
  viewId: string;
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
    handleCustomViewCrash(this.props.pluginId, this.props.viewId, error);
  }

  render() {
    if (this.state.crashed) {
      return null;
    }
    return this.props.children;
  }
}
