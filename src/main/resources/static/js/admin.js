document.addEventListener('DOMContentLoaded', function () {
    const usersTableBody = document.querySelector('#users-table tbody');
    const createUserForm = document.getElementById('create-user-form');
    const logoutBtn = document.getElementById('logout-btn');

    const token = localStorage.getItem('jwt');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/v1/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 401 || response.status === 403) {
                alert('You are not authorized to view this page.');
                window.location.href = '/index.html';
                return;
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const users = await response.json();
            renderUsers(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const renderUsers = (users) => {
        usersTableBody.innerHTML = '';
        if (users.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 3;
            cell.textContent = 'No users found.';
            row.appendChild(cell);
            usersTableBody.appendChild(row);
        } else {
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.roles}</td>
                `;
                usersTableBody.appendChild(row);
            });
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt');
        window.location.href = '/login.html';
    };

    logoutBtn.addEventListener('click', logout);

    createUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(createUserForm);
        const userRequest = {
            username: formData.get('username'),
            password: formData.get('password'),
            roles: formData.get('roles'),
        };

        try {
            const response = await fetch('/api/v1/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userRequest),
            });

            if (response.ok) {
                createUserForm.reset();
                fetchUsers(); // Refresh the table
            } else {
                const errorData = await response.json();
                alert(`Error creating user: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('An unexpected error occurred.');
        }
    });

    // Initial fetch of users
    fetchUsers();
});
