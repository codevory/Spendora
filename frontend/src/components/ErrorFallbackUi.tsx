import React from 'react';

interface SpendoraErrorFallbackProps {
  error?: Error | null;
  onReset?: () => void;
}

export const ErrorFallbackUi: React.FC<SpendoraErrorFallbackProps> = ({
  error,
  onReset,
}) => {
  const handleReload = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
         <div style={styles.iconContainer}>
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <line x1="3" y1="3" x2="21" y2="21" stroke="#EF4444" strokeWidth="2" />
          </svg>
        </div>

        <h1 style={styles.title}>System Ledger Interrupted</h1>
        <p style={styles.subtitle}>
          Don’t worry, your financial data and transaction records are completely safe and secure.
        </p>

        {error?.message && (
          <div style={styles.errorBox}>
            <span style={styles.errorLabel}>Diagnostic Ref:</span>
            <code style={styles.errorCode}>{error.message}</code>
          </div>
        )}

        <div style={styles.actions}>
          <button onClick={handleReload} style={styles.primaryButton}>
            Re-sync App
          </button>
          
          <a href="/" style={styles.secondaryButton}>
            Return to Dashboard
          </a>
        </div>

        {/* Footer Guarantee */}
        <div style={styles.footerNote}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>256-bit encrypted data protection active</span>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC', // Soft modern background
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '1.5rem',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
    maxWidth: '480px',
    width: '100%',
    padding: '2.5rem',
    textAlign: 'center',
    border: '1px solid #E2E8F0',
  },
  iconContainer: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#FEE2E2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem auto',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0F172A',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#64748B',
    lineHeight: '1.5',
    margin: '0 0 1.5rem 0',
  },
  errorBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    textAlign: 'left',
    margin: '0 0 1.5rem 0',
    fontSize: '0.85rem',
    wordBreak: 'break-word',
  },
  errorLabel: {
    display: 'block',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '0.25rem',
  },
  errorCode: {
    fontFamily: 'monospace',
    color: '#DC2626',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  primaryButton: {
    backgroundColor: '#10B981', // Spendora Green
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.25rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#475569',
    border: '1px solid #CBD5E1',
    borderRadius: '8px',
    padding: '0.75rem 1.25rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-block',
  },
  footerNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    marginTop: '2rem',
    fontSize: '0.75rem',
    color: '#94A3B8',
  },
};