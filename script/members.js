let members = [
    member('Haddadi', 'Youssef', 'ASEDS', 'INE1'),
    member('WINA', 'OTHMANE', 'ASEDS', 'INE1'),
    member('Jahid', 'Alae', 'ASEDS', 'INE1'),
    member('Boutamment', 'Mohamed', 'AMOA', 'INE1'),
    member('Ertil', 'Riyad', 'ASEDS', 'INE1'),
];

let admins = [
    admin('El mechkouri', 'Seleymane', 'CLOUD', 'INE2', 'Vice President'),
    admin('Hrara', 'Mouloud', 'SESNUM', 'INE2', 'Logistic Chief'),
    admin('Ait said', 'Abdelouakel', 'CLOUD', 'INE2', 'Tresury'),
    admin('Akhraz', 'Abdesamad', 'DATA', 'INE2', 'President'),
    admin('Nait hmad oubrahim', 'Abdelali', 'CLOUD', 'INE2', 'Design Chief'),
    admin('Hafidi', 'Ayoub', 'CLOUD', 'INE2', 'Caravan Chief'),
    admin('El Hazal', 'Salma', 'CLOUD', 'INE2', 'Caravan co-Chief'),
    admin('Addah', 'Aicha', 'Smart', 'INE2', 'General Secretary'),
    admin('Ouissit', 'Lamyae', 'Smart', 'INE2', 'Media Chief'),
    admin('Safi', 'Yahya', 'CLOUD', 'INE2', 'Media co-Chief'),
    admin('Touama', 'Sara', 'AMOA', 'INE2', 'Sponsoring Chief'),
    admin('404', 'Naima', 'CLOUD', 'INE2', 'Orphans Project Chief'),
]

function member(family_name, personal_name, major, ine){
    return {family_name, personal_name, major, ine};
}

function admin(family_name, personal_name, major, ine, poste){
    return {family_name, personal_name, major, ine, poste};
}

let buttons = '';
let th = '';

function isAdmin(onAdmin){
    buttons = `
    <td>
        <button class="button delete" onclick="deleteMember(this)">
            <i class="fa-solid fa-trash"></i>
        </button>
        <button class="button update" onclick="updateMember(this)">
            <i class="fa-solid fa-pen"></i>
        </button>
    </td>
    `
    th = '<th>OPERATIONS</th>'
    document.querySelector('.add-button').innerHTML = `<button class="add" onclick="addMember(${onAdmin})">+</button>`
}

function displayMembers(){
    let html = `
        <table class="membersTable">
            <tr>
                <th>FAMILY NAME</th>
                <th>PERSONAL NAME</th>
                <th>MAJOR</th>
                <th>INE</th>
                ${th}
            </tr>`;
    members.forEach(member => {
        html += `
        <tr>
            <td>${member.family_name}</td>
            <td>${member.personal_name}</td>
            <td>${member.major}</td>
            <td>${member.ine}</td>
            ${buttons}
        </tr>`
    })
    html += `</table>`
    document.querySelector('.container').innerHTML = html;
}

function displayAdmins(){
    let html = `
        <table class="adminsTable">
            <tr>
                <th>FAMILY NAME</th>
                <th>PERSONAL NAME</th>
                <th>MAJOR</th>
                <th>INE</th>
                <th>POSTE</th>
                ${th}
            </tr>`;
    admins.forEach(admin => {
        html += `
        <tr>
            <td>${admin.family_name}</td>
            <td>${admin.personal_name}</td>
            <td>${admin.major}</td>
            <td>${admin.ine}</td>
            <td>${admin.poste}</td>
            ${buttons}
        </tr>`
    })
    html += `</table>`
    document.querySelector('.container').innerHTML = html;
}

function deleteMember(button, cancel){
    let row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    
    if(!cancel){
        //this part should delete the member from the database 
    }
}

function updateMember(button){
    let row = button.parentNode.parentNode; 
    let cells = row.querySelectorAll("td:not(:last-child)");
    let originalValues = [];
    
    cells.forEach(cell => {
        let text = cell.innerText;
        originalValues.push(text);
        cell.innerHTML = `<input type="text" value="${text}">`;
    });
    
    let operationsCell = row.lastElementChild;
    operationsCell.innerHTML = `
            <button class="button save" onclick="saveRow(this)"><i class="fa-solid fa-save"></i></button>
            <button class="button reset" onclick='resetRow(this, ${JSON.stringify(originalValues)})'><i class="fa-solid fa-refresh"></i></button>
        `;
}

function saveRow(button) {
    let row = button.parentNode.parentNode;
    let cells = row.querySelectorAll("td:not(:last-child)");
    
    cells.forEach(cell => {
        let input = cell.querySelector("input");
        if (input) {
            cell.innerText = input.value;
        }
    });
    
    let operationsCell = row.lastElementChild;
    operationsCell.innerHTML = `
            <button class="button delete" onclick="deleteMember(this)"><i class="fa-solid fa-trash"></i></button>
            <button class="button update" onclick="updateMember(this)"><i class="fa-solid fa-pen"></i></button>
        `;
    
    //this part should update the member in the database
}

function resetRow(button, originalValues) {
    let row = button.parentNode.parentNode;
    let cells = row.querySelectorAll("td:not(:last-child)");
    
    cells.forEach((cell, index) => {
        cell.innerText = originalValues[index];
    });
    
    let operationsCell = row.lastElementChild;
    operationsCell.innerHTML = `
            <button class="button delete" onclick="deleteMember(this)"><i class="fa-solid fa-trash"></i></button>
            <button class="button update" onclick="updateMember(this)"><i class="fa-solid fa-pen"></i></button>
        `;
}

function addMember(admin){
    let table;
    if(admin) {
        table = document.querySelector(".adminsTable");
    }
    else {
        table = document.querySelector(".membersTable");
    }
    let newRow = document.createElement("tr");
    let columns = ["FAMILY NAME", "PERSONAL NAME", "MAJOR", "INE"];
    if(admin) columns.push("POSTE");
    
    columns.forEach(() => {
        let cell = document.createElement("td");
        let input = document.createElement("input");
        input.type = "text";
        cell.appendChild(input);
        newRow.appendChild(cell);
    });
    
    let operationsCell = document.createElement("td");
    operationsCell.innerHTML = `
        <button class="button save" onclick="saveNewRow(this)"><i class="fa-solid fa-save"></i></button>
        <button class="button delete" onclick="deleteMember(this, true)"><i class="fa-solid fa-close"></i></button>
    `;
    
    newRow.appendChild(operationsCell);
    table.appendChild(newRow);
}

function saveNewRow(button) {
    let row = button.parentNode.parentNode;
    let cells = row.querySelectorAll("td:not(:last-child)");
    
    let emptyFields = false;
    cells.forEach(cell => {
        let input = cell.querySelector("input");
        if (!input.value.trim()) {
            emptyFields = true;
        }
    });
    
    if (emptyFields) {
        alert("Please fill in all fields before saving.");
        return;
    }
    
    cells.forEach(cell => {
        let input = cell.querySelector("input");
        if (input) {
            cell.innerText = input.value;
        }
    });
    
    let operationsCell = row.lastElementChild;
    operationsCell.innerHTML = `
        <button class="button delete" onclick="deleteMember(this)"><i class="fa-solid fa-trash"></i></button>
        <button class="button update" onclick="updateMember(this)"><i class="fa-solid fa-pen"></i></button>
    `;

    //this part should add member to the database
}