// Variables
let passwordStrength = 0;
let usernameInput = document.getElementById('username');
let passwordInput = document.getElementById('password');
let form = document.getElementById('form_id');

// Password reveal function
let isPasswordVisible = false;
let passwordRevealIcon = document.querySelector('.password-reveal-icon');

function togglePassword() {
    if (isPasswordVisible) {
        passwordInput.type = 'password';
        passwordRevealIcon.classList.remove('show');
        passwordRevealIcon.classList.add('hide');
        isPasswordVisible = false;
    } else {
        passwordInput.type = 'text';
        passwordRevealIcon.classList.remove('hide');
        passwordRevealIcon.classList.add('show');
        isPasswordVisible = true;
    }
}

// Attach the togglePassword function to the icon's click event
passwordRevealIcon.addEventListener('click', togglePassword);

// Check password strength function
function checkPasswordStrength(password) {
    if (password.length < 8) {
        passwordStrength = 0;
    } else if (password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/[0-9]/)) {
        passwordStrength = 2;
    } else {
        passwordStrength = 1;
    }
}

// Add event listener for password input
passwordInput.addEventListener('input', () => {
    checkPasswordStrength(passwordInput.value);
});

// Form submission logic with backend validation for login
document.getElementById('form_id').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('login-error-message');

    if (!username || !password) {
        alert('Please enter both username and password.');
        errorMessage.textContent = 'Please enter both username and password.';
        return; // Stop execution if fields are empty
    }

    try {
        const response = await fetch('ticket-management-system-ej5xngnuc-derojuus-projects.vercel.app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Login successful!');
            this.reset();
            window.location.href = '/welcome.html'; // Redirect upon successful login
        } else {
            alert('Login failed: ' + result.error);
            errorMessage.textContent = result.error;
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
        
    }
});
