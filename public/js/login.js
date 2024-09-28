document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const target = this.getAttribute('data-target');

                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

                this.classList.add('active');
                document.getElementById(target).classList.add('active');
            });
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.text().then(text => {
                alert(text);
                throw new Error(text);
            });
        }
    })
    .then(data => {
        console.log('Redirecting to:', data.redirectTo);
        if (data.redirectTo) {
            alert(data.message);
            window.location.href = data.redirectTo; // Redirect to the specified URL
        }
    })
    .catch(error => {
        alert('An error occurred while logging in. Please try again.');
    });
});



