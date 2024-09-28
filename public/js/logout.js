// Function to get query parameters
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Handle logout success message
document.addEventListener('DOMContentLoaded', () => {
    const message = getQueryParameter('message');
    if (message === 'logout-success') {
        alert('You have been successfully logged out.');
    }
});
