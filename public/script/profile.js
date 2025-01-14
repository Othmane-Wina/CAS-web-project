


document.getElementById('updateEmailForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newEmail = document.getElementById('newEmail').value;

    const response = await fetch('/profile/update-email', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ newEmail })
    });

    const data = await response.json();
    alert(data.message || 'Email updated');
});

document.getElementById('updatePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    const response = await fetch('/profile/update-password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
    });

    const data = await response.json();
    alert(data.message || 'Password updated');
});

document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
    const confirmDelete = confirm('Are you sure you want to delete your account?');
    if (!confirmDelete) return;

    const response = await fetch('/auth/delete-account', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const data = await response.json();
    if (data.message) {
        localStorage.clear();
        window.location.href = './../auth.html';
    } else {
        alert('Failed to delete account');
    }
});
