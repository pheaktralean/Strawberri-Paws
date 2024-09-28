
document.getElementById('signupForm').addEventListener('submit', function(event) {

  //event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const errorMessagesDiv = document.getElementById('errorMessages');
    errorMessagesDiv.innerHTML = ''; // Clear previous error

    // Check if username is valid (only letters and digits)
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
        errorMessagesDiv.textContent = 'Username can only contain letters and digits.';
        event.preventDefault(); 
        return;
    }

    // Check if password is valid (at least 4 characters long, letters and digits only, contains at least one letter and one digit)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;
    if (!passwordRegex.test(password)) {
        errorMessagesDiv.textContent = 'Password must be at least 4 characters long, only letters and digits and contains at least one letter and one digit.';
        event.preventDefault(); 
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        errorMessagesDiv.textContent = 'Passwords do not match.';
        event.preventDefault(); 
        return;
    }

    console.log('Form submission proceeding...');
    event.preventDefault();

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, confirmPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            window.location.href = '/login'; // Redirect to login page
        } else {
            // Display error message
            errorMessagesDiv.textContent = data.message;
            errorMessagesDiv.style.fontWeight = 'bolder';
            errorMessagesDiv.style.marginTop = '5px';
            errorMessagesDiv.style.marginBottom = '5px';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorMessagesDiv.textContent = 'An unexpected error occurred. Please try again.';
        errorMessagesDiv.style.color = 'darkred';
        errorMessagesDiv.style.fontWeight = 'bolder';
        errorMessagesDiv.style.marginTop = '5px';
        errorMessagesDiv.style.marginBottom = '5px';
    });
});
