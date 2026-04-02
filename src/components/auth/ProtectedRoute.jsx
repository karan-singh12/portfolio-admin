import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { APP_FLAGS } from '@/config/constants';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // Development bypass: Allow dashboard without auth if flag is enabled
  const isDashboardRoute = location.pathname === '/dashboard';
  const shouldBypassAuth = APP_FLAGS.BYPASS_AUTH_FOR_DASHBOARD && isDashboardRoute;

  if (!isAuthenticated && !shouldBypassAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

