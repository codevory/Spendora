import { Component } from 'react';
import type { ErrorInfo,ReactNode } from 'react'

interface Props {
  children: ReactNode;
  fallback?: ReactNode; 
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React render error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong.</h2>
          <p style={{ color: '#666' }}>{this.state.error?.message ?? "Failed to communicate with backend"}</p>
          <button 
            onClick={this.handleReset}
            style={{ padding: '8px 16px', cursor: 'pointer', marginTop: '10px' }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}