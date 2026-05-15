import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (!token) {
        return <Navigate to="admin/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        if (!userString) {
            // Token exists but no user info? Suspicious or partial state. Redirect to login.
            return <Navigate to="/login" replace />;
        }

        try {
            const user = JSON.parse(userString);
            if (!allowedRoles.includes(user.role)) {
                // User logged in but doesn't have permission.
                // If they are admin trying to access restricted admin pages, maybe send to admin login?
                // Or if they are user trying to access admin, send to 404 or dashboard.
                // For now, if role mismatch, mostly likely a user trying to access admin.
                return <Navigate to="admin/dashboard" replace />;
            }
        } catch (e) {
            console.error("Error parsing user from local storage", e);
            return <Navigate to="admin/login" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
