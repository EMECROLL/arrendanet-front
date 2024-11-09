import { Navigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, userRole } = useAuth();
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && !requiredRole.includes(userRole)) {
        return <Navigate to="/unauthorized" />;
    }

    return children
};

export default ProtectedRoute;
