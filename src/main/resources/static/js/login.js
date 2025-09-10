document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessageDiv.textContent = '';

        const formData = new FormData(loginForm);
        const loginRequest = {
            username: formData.get('username'),
            password: formData.get('password'),
        };

        try {
            const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginRequest),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('jwt', data.jwt);
                window.location.href = '/index.html';
            } else {
                errorMessageDiv.textContent = 'Invalid username or password.';
            }
        } catch (error) {
            console.error('Error logging in:', error);
            errorMessageDiv.textContent = 'An unexpected error occurred.';
        }
    });
});
