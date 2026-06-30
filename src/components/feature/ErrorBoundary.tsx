import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error | null): State {
    return {
      hasError: true,
      error: error instanceof Error ? error : null,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error | null, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error instanceof Error ? error : null,
      errorInfo
    });
    
    // If it's a DOM error (null error from appendChild etc), attempt silent recovery
    if (!error || !(error instanceof Error)) {
      setTimeout(() => {
        if (this.state.hasError) {
          this.handleReset();
        }
      }, 100);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-slate-900/50 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-error-warning-line text-5xl text-red-400"></i>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Something Went Wrong</h1>
            <p className="text-gray-400 mb-6">
              We encountered an unexpected error. Don't worry, your progress is saved.
            </p>
            {this.state.error && (
              <div className="bg-black/30 rounded-lg p-4 mb-6 text-left">
                <p className="text-red-400 text-sm font-mono break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <div className="flex justify-center space-x-4">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-cyan-400 text-black font-semibold rounded-lg hover:bg-cyan-300 transition-all cursor-pointer whitespace-nowrap"
              >
                Return to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border border-cyan-400 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-400/10 transition-all cursor-pointer whitespace-nowrap"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
