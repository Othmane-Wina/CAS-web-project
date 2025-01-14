document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    const formTitle = document.getElementById('form-title');
    const toggleText = document.getElementById('toggle-text');
    const toggleAuthLink = document.getElementById('toggle-auth');
    const nameFields = document.getElementById('name-fields');
    const submitButton = document.getElementById('submit-button');
    
    let isRegistering = false; // Tracks whether the user is registering or logging in
    
    // Toggle between Login and Register
    toggleAuthLink.addEventListener('click', (e) => {
        e.preventDefault();
        isRegistering = !isRegistering;
        
        if (isRegistering) {
            formTitle.textContent = 'Register';
            toggleText.innerHTML = 'Already have an account? <a href="#" id="toggle-auth">Login</a>';
            nameFields.style.display = 'block';
            submitButton.textContent = 'Register';
        } else {
            formTitle.textContent = 'Login';
            toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-auth">Register</a>';
            nameFields.style.display = 'none';
            submitButton.textContent = 'Login';
        }
    });
    
    // Handle form submission
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Collect data from the form
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        let requestData = {
            email,
            password,
        };
        
        let endpoint = '/auth/login'; // Default to login endpoint
        
        if (isRegistering) {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            
            // Validate fields
            if (!email || !password || !firstName || !lastName) {
                alert('Please fill in all fields.');
                return;
            }
            
            requestData = { ...requestData, firstName, lastName };
            endpoint = '/auth/register'; // Switch to registration endpoint
        }
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token); // Store token in localStorage
                alert(isRegistering ? 'Registration successful!' : 'Login successful!');
                window.location.href = 'index.html'; // Redirect after success
            } else {
                alert(data.message || 'An error occurred.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Something went wrong. Please try again.');
        }
    });
    
    // Logout functionality
    const logoutButton = document.querySelector('.login');
    const isLoggedIn = !!localStorage.getItem('token');
    
    if (isLoggedIn) {
        logoutButton.textContent = 'Logout';
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'auth.html';
        });
    }
});
