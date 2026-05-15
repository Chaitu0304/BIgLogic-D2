import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { authService } from '../services/api';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (!token) return <Navigate to="/login" replace />;

    try {
        const user = JSON.parse(userString || '{}');
        if (user.role === 'superadmin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
    } catch (e) {
        console.error("Error parsing user from local storage", e);
    }

    useEffect(() => {
        const refreshUser = async () => {
            if (token) {
                try {
                    const res = await authService.getMe();
                    // Preserve the token, update other user details
                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    const updatedUser = { ...currentUser, ...res.data };
                    // Ensure token is kept if backend doesn't return it in getMe (usually doesn't)
                    if (currentUser.token) updatedUser.token = currentUser.token;

                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    // Note: This won't trigger re-render of components using localStorage immediately 
                    // unless they listen to storage events or re-mount. 
                    // Ideally use a Context, but for now this updates the source of truth for next reads.
                } catch (error) {
                    console.error("Failed to refresh user session", error);
                    // Optional: Logout if invalid? 
                    // localStorage.removeItem('token'); 
                }
            }
        };
        refreshUser();
    }, [token]);

    // Simple check: if token exists and not superadmin (checked above), render child routes (Outlet)
    // Otherwise, redirect to login page. (Fallback)
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
