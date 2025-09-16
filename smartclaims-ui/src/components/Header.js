import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Header.css';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Ensure user.roles is a string before splitting
    let userRoles = [];
    if (user?.roles) {
        if (Array.isArray(user.roles)) {
            userRoles = user.roles;
        } else if (typeof user.roles === 'string') {
            userRoles = user.roles.split(',');
        }
    }
    const isAdmin = userRoles.includes('ROLE_ADMIN');

    return (
        <header className="app-header">
            <div className="header-title">
                <h1>SmartClaims360</h1>
            </div>
            <nav className="header-nav">
                {user && (
                    <>
                        <span>Welcome, {user.username}</span>
                        <Link to="/process-claim" className="nav-link">Process a Claim</Link>
                        {isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
