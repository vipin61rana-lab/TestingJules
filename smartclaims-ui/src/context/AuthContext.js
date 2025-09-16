import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [jwt, setJwt] = useState(() => localStorage.getItem('jwt'));

    useEffect(() => {
        if (jwt) {
            try {
                const decoded = jwtDecode(jwt);
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
        } else {
            setUser(null);
        }
    }, [jwt]);

    const login = (newJwt) => {
        localStorage.setItem('jwt', newJwt);
        setJwt(newJwt);
    };

    const logout = () => {
        localStorage.removeItem('jwt');
        setJwt(null);
    };

    return (
        <AuthContext.Provider value={{ user, jwt, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
