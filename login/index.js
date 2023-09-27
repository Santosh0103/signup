document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send a POST request to the server for user login
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        // If the login was successful, store the JWT token in localStorage
        const token = data.token;
        localStorage.setItem('token', token);
        // Function to verify if a token exists in localStorage
        function verifyToken() {
            const token = localStorage.getItem('token');
            if (!token) {
                return false;
            }
            return true;
        }
        if (verifyToken()) {
            // Send a GET request to verify the token on the server
            const response1 = await fetch('http://localhost:3000/verifytoken', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const data1 = await response1.json();
            if (response1.ok) {
                // If token verification is successful, show a success message and redirect
                alert(data1.message);
                window.location.href = '../home/dashboard.html';
            }
            else {
                document.getElementById('message').textContent = data1.message;
            }
        }
    } else {
        document.getElementById('message').textContent = data.message;
    }

});