import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    minHeight: '100vh', gap: '1rem', padding: '2rem', textAlign: 'center',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)',
                }}>
                    <div style={{ fontSize: '4rem' }}>⚠️</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Something went wrong</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
                        {this.state.error?.message || 'An unexpected error occurred.'}
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
                    >
                        Return Home
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
