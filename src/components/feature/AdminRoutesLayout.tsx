import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import PageLoading from '../PageLoading';

export default function AdminRoutesLayout() {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <PageLoading
        message="Authenticating Admin Session..."
        subtitle="Verifying clearance credentials"
        className="min-h-screen bg-gray-900 text-cyan-400"
        messageClassName="font-medium"
      >
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageLoading>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/admin-login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  return <Outlet />;
}