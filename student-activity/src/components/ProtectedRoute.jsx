import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ role, children }) => {
    const { user } = useAuthContext();

    if (!user) return <Navigate to={`/login?role=${role}`} replace />;
    if (user.role !== role) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
    }
    return children;
};

export default ProtectedRoute;
