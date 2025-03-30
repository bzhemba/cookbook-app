document.getElementById('sign-in-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/auth/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const result = await response.json();
        console.log(result);

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