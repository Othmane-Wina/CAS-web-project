// Fetch and display members
async function fetchMembers() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/super/members', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        const members = await response.json();
        displayTable(members, false);
    } catch (error) {
        console.error('Error fetching members:', error);
    }
}

async function fetchAdmins() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/super/admins', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        const admins = await response.json();
        displayTable(admins, true);
    } catch (error) {
        console.error('Error fetching admins:', error);
    }
}

function displayTable(data, isAdmin) {
    let html = `
        <table class="membersTable">
            <tr>
                <th>LAST NAME</th>
                <th>FIRST NAME</th>
                <th>GRADE</th>
                <th>STREAM</th>
                ${isAdmin ? '' : '<th>ACTIONS</th>'}
            </tr>
    `;
    data.forEach(item => {
        html += `
            <tr>
                <td>${item.lastName}</td>
                <td>${item.firstName}</td>
                <td>${item.grade}</td>
                <td>${item.stream}</td>
                ${isAdmin ? '' : `
                <td>
                    <button class="button delete" onclick="deleteRow('${item.email}')"><i class="fa-solid fa-trash"></i></button>
                    <button class="button update" onclick="editRow(this)"><i class="fa-solid fa-pen"></i></button>
                    <button class="button promote" onclick="moveToAdmin('${item.firstName}', '${item.lastName}', '${item.grade}', '${item.stream}')">
                        <i class="fa-solid fa-arrow-up"></i>
                    </button>
                </td>`}
            </tr>
        `;
    });
    html += '</table>';
    document.querySelector('.container').innerHTML = html;
}

// Add a new row
function addRow() {
    const table = document.querySelector('.membersTable');
    const newRow = `
        <tr>
            <td><input type="text" placeholder="Last Name"></td>
            <td><input type="text" placeholder="First Name"></td>
            <td><input type="text" placeholder="Grade"></td>
            <td><input type="text" placeholder="Stream"></td>
            <td>
                <button class="button save" onclick="saveRow(this)"><i class="fa-solid fa-save"></i></button>
                <button class="button cancel" onclick="cancelRow(this)"><i class="fa-solid fa-times"></i></button>
            </td>
        </tr>
    `;
    table.insertAdjacentHTML('beforeend', newRow); // Dynamically appends the new row to the end of the table without page reload.
}

// Save a new or modified row
async function saveRow(button) {
    const row = button.closest('tr');
    const inputs = row.querySelectorAll('input');

    const newData = {
        lastName: inputs[0].value.trim(),
        firstName: inputs[1].value.trim(),
        grade: inputs[2].value.trim(),
        stream: inputs[3].value.trim(),
    };
    
    if (!newData.lastName || !newData.firstName || !newData.grade || !newData.stream) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/super/members', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(newData),
        });

        if (response.ok) {
            alert('Data saved successfully.');
            fetchMembers(); // Refresh the members table
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error saving row:', error);
    }
}

// Move member to admin
async function moveToAdmin(firstName, lastName, grade, stream) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/super/members/move-to-admin', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ firstName, lastName, grade, stream }),
        });

        if (response.ok) {
            alert('Member moved to admin successfully.');
            fetchMembers();
            fetchAdmins();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error moving member to admin:', error);
    }
}

// Edit an existing row
function editRow(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td:not(:last-child)');

    cells.forEach((cell) => {
        const text = cell.textContent;
        cell.innerHTML = `<input type="text" value="${text}">`;
    });

    const actionsCell = row.querySelector('td:last-child');
    actionsCell.innerHTML = `
        <button class="button save" onclick="saveRow(this)"><i class="fa-solid fa-save"></i></button>
        <button class="button cancel" onclick="cancelEdit(this)"><i class="fa-solid fa-times"></i></button>
    `;
}

// Delete a row
async function deleteRow(email) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/super/members/${email}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            },
        });

        if (response.ok) {
            alert('Member deleted successfully.');
            fetchMembers();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error deleting row:', error);
    }
}

// Cancel adding a new row
function cancelRow(button) {
    button.closest('tr').remove();
}

// Cancel editing a row
function cancelEdit(button) {
    const row = button.closest('tr');
    fetchMembers();
}
