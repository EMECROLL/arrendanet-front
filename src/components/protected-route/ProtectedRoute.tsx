import { Navigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Loading from '../../views/error/Loading/Loading';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, userRole, loading } = useAuth();

    // Show loading indicator or blank space while loading
    if (loading) {
        return <Loading/>;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && !requiredRole.includes(userRole)) {
        return <Navigate to="/unauthorized" />;
    }

    return children
};

export default ProtectedRoute;
