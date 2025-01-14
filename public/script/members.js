const fetchMembers = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/super/members', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });

    if (!response.ok) {
        console.error("Failed to fetch members:", response.statusText);
        return;
    }

    const members = await response.json();
    const tbody = document.querySelector('#members-table tbody');
    tbody.innerHTML = '';

    members.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.email}</td>
            <td>${member.stream}</td>
            <td>${member.grade}</td>
            <td><button class="delete-btn" id="member-${member.email}">Delete</button></td>
        `;
        console.log(member.email);
    
        // Add event listener for delete button
        row.querySelector('.delete-btn').addEventListener('click', async (e) => {
            const memberEmail = e.target.id.replace('member-', ''); // Strip the "member-"
            console.log("Deleting member with email:", memberEmail);
    
            if (!memberEmail) {
                console.error("No member ID found for delete button");
                return;
            }
    
            const deleteResponse = await fetch(`/super/members/${memberEmail}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
    
            if (deleteResponse.ok) {
                alert('Member deleted successfully');
                fetchMembers(); // Refresh the table
            } else {
                const errorData = await deleteResponse.json();
                console.error("Failed to delete member:", errorData.message);
                alert(errorData.message);
            }
        });
    
        tbody.appendChild(row);
    });    
};


document.querySelector('#member-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const stream = document.querySelector('#stream').value;
    const grade = document.querySelector('#grade').value;

    const token = localStorage.getItem('token');
    const response = await fetch('/super/members', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ email, stream, grade })
    });

    if (response.ok) {
        document.querySelector('#member-form').reset();
        fetchMembers();
    } else {
        const data = await response.json();
        console.error("Failed to add member:", data.message);
        alert(data.message);
    }
});

fetchMembers();
