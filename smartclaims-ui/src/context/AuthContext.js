import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Using named import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('jwt'));

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({
                        username: decoded.sub,
                        roles: decoded.roles
                    });
                }
            } catch (error) {
                console.error("Invalid token", error);
                logout();
            }
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('jwt', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('jwt');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
