import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = localStorage.getItem('session');
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
