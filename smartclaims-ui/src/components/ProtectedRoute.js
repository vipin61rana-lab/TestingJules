import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token } = useContext(AuthContext);

    if (!token) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user?.roles) {
        const userRoles = user.roles.split(',');
        const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));

        if (!hasRequiredRole) {
            // Logged in, but does not have the required role
            // Redirect to a "not authorized" page or back to the dashboard
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
