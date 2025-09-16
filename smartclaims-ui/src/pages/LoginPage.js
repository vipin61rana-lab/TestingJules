import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { login as loginService } from '../services/apiService';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await loginService({ username, password });
            if (data.token) {
                login(data.token);
                navigate('/');
            } else {
                setError('Login failed: No token received.');
            }
        } catch (err) {
            setError('Invalid username or password.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>SmartClaims360 Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="btn-login">Login</button>
                </form>
                 <div className="login-info">
                    <p>Use credentials to login:</p>
                    <ul>
                        <li><b>Admin:</b> vipin / password</li>
                        <li><b>User:</b> rahul / password</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
