import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { getUsers, createUser } from '../services/apiService';
import './AdminPage.css';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newUser, setNewUser] = useState({ username: '', password: '', roles: 'ROLE_USER' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users. You may not have permission to view this page.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await createUser(newUser);
            setNewUser({ username: '', password: '', roles: 'ROLE_USER' });
            fetchUsers();
        } catch (err) {
            setError('Failed to create user.');
            console.error(err);
        }
    };

    return (
        <div>
            <Header />
            <main className="admin-container">
                <h2>User Management</h2>

                <div className="admin-section">
                    <h3>Create New User</h3>
                    <form onSubmit={handleCreateUser} className="user-form">
                        <input
                            type="text"
                            placeholder="Username"
                            value={newUser.username}
                            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                            required
                        />
                        <select
                            value={newUser.roles}
                            onChange={e => setNewUser({ ...newUser, roles: e.target.value })}>
                            <option value="ROLE_USER">User</option>
                            <option value="ROLE_ADMIN,ROLE_USER">Admin</option>
                        </select>
                        <button type="submit">Create User</button>
                    </form>
                </div>

                <div className="admin-section">
                    <h3>All Users</h3>
                    {isLoading && <p>Loading users...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!isLoading && !error && (
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Roles</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td title={user.id}>{user.id.substring(0, 8)}...</td>
                                        <td>{user.username}</td>
                                        <td>{user.roles}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminPage;
