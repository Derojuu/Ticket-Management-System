document.getElementById('resetpasswordform').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const newPassword = document.getElementById('password').value;
    const confirmPassword = document.getElementById('retypePassword').value;
  
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    fetch('/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, newPassword }),
    }).then(response => response.json()).then(data => {
      if (data.success) {
        alert('Password reset successfully!');
        window.location.href = '/index.html'; // Redirect to login page
      } else {
        alert('Error resetting password: ' + data.message);
      }
    }).catch(error => {
      console.error('Error:', error);
      alert('Error resetting password.');
    });
  });
  