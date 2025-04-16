document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const retypePassword = document.getElementById('retypePassword').value;
    const errorMessage = document.getElementById('error-message');

    if (password !== retypePassword) {
        errorMessage.textContent = 'Passwords do not match!';
    } else if (!checkPasswordStrength(password)) {
        errorMessage.textContent = 'Password is too weak!';
    } else {
        errorMessage.textContent = '';

        // Send data to the backend
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Registration successful!');
                window.location.href = '/index.html'; // Redirect to login page
            } else {
                errorMessage.textContent = result.error;
            }
        } catch (error) {
            errorMessage.textContent = 'An error occurred. Please try again.';
        }
    }
});

// Check password strength function
function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('password-strength');
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++; // Special characters

    // Update the strength bar visual
    let strengthMessage = '';
    switch (strength) {
        case 0:
        case 1:
            strengthMessage = 'Very Weak';
            strengthBar.style.color = 'red';
            break;
        case 2:
            strengthMessage = 'Weak';
            strengthBar.style.color = 'orange';
            break;
        case 3:
            strengthMessage = 'Good';
            strengthBar.style.color = 'yellow';
            break;
        case 4:
            strengthMessage = 'Strong';
            strengthBar.style.color = 'green';
            break;
        case 5:
            strengthMessage = 'Very Strong';
            strengthBar.style.color = 'darkgreen';
            break;
    }
    strengthBar.textContent = strengthMessage;
    return strength >= 3; // Ensure at least 'Good' strength
}

// Add event listener for password input
document.getElementById('password').addEventListener('input', () => {
    checkPasswordStrength(document.getElementById('password').value);
});

// Add event listener to reset form and strength bar on outside click
document.addEventListener('click', function(event) {
    const form = document.getElementById('registerForm');
    const strengthBar = document.getElementById('password-strength');
    if (!form.contains(event.target)) {
        form.reset();
        strengthBar.textContent = ''; // Clear the strength bar visual
        strengthBar.style.color = ''; // Reset the color
    }
});
