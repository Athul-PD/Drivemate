import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredWorkspace?: boolean; // true if user MUST have a workspace, false if must NOT have
}

export const ProtectedRoute = ({ 
  children, 
  requiredWorkspace 
}: ProtectedRouteProps) => {
  const { user, loading, hasWorkspace } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-slate-900">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  // Not logged in - redirect to signin
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Logged in but workspace check not complete
  if (hasWorkspace === null) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-slate-900">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  // For AdminUser page - user must NOT have a workspace
  if (requiredWorkspace === false && hasWorkspace) {
    return <Navigate to="/dashboard" replace />;
  }

  // For Dashboard - user MUST have a workspace
  if (requiredWorkspace === true && !hasWorkspace) {
    return <Navigate to="/adminuser" replace />;
  }

  return <>{children}</>;
};
