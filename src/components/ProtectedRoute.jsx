import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Acesso Negado</h2>
        <p>Apenas administradores podem aceder a esta página.</p>
      </div>
    );
  }

  return children;
};