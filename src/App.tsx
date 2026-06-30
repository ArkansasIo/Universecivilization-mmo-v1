import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import GameLoop from './components/feature/GameLoop';
import { Suspense, useEffect } from 'react';
import ErrorBoundary from './components/feature/ErrorBoundary';
import { ThemeProvider } from '@/hooks/useTheme';

function App() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const err = event.error;
      if (err) {
        console.error('Global error caught:', err.message || err, err.stack);
      } else {
        console.error('Global error caught — null error object', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (reason instanceof Error) {
        console.error('Unhandled promise rejection:', reason.message, reason.stack);
      } else {
        console.error('Unhandled promise rejection:', reason);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <AuthProvider>
            <AdminAuthProvider>
              <div className="min-h-screen bg-background-50">
                <GameLoop />
                <Suspense fallback={
                  <div className="min-h-screen bg-background-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mb-4"></div>
                      <div className="text-primary-500 text-xl font-heading">Loading...</div>
                      <p className="text-foreground-700 text-sm mt-2">Preparing command interface</p>
                    </div>
                  </div>
                }>
                  <AppRoutes />
                </Suspense>
              </div>
            </AdminAuthProvider>
          </AuthProvider>
        </BrowserRouter>
        </ThemeProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}

export default App;