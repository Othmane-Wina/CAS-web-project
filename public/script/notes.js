async function fetchNotes() {
    const token = localStorage.getItem('token');
    const response = await fetch('/super/notes', {
        headers: { Authorization: token },
    });
    const notes = await response.json();
    displayNotes(notes);
}

function displayNotes(notes) {
    const slider = document.getElementById('notesSlider');
    slider.innerHTML = notes.map(note => `<div>${note.content}</div>`).join('');
}

document.getElementById('noteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/super/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({ content }),
        });

        if (response.ok) {
            e.target.reset();
            fetchNotes();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error adding note:', error);
    }
});

fetchNotes();
