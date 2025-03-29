document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/auth/logIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });

        const result = await response.json();
        localStorage.setItem('auth_token', result.access_token);
        localStorage.setItem('username', username);
        console.log(`USERNAME: ${localStorage.getItem('username')}`);
        if (response.ok) {
            alert('Login successful!');
            window.location.href = '/';
        } else {
            alert('Login failed: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login.');
    }
});

document.getElementById('sign-in-link').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/sign-in';
});