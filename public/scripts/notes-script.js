import { SSENotifier } from './SseNotifier.js';

async function displayItems() {
    const token = localStorage.getItem('auth_token');
    const username = localStorage.getItem('username');

    if (!token) {
        console.error('No token found, please log in');
        return;
    }

    try {
        const response = await fetch(`/notes/${username}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
        if (!response.ok) throw new Error("Failed to load notes");
        const data = await response.json();
        await showData(data);
    } catch (error) {
        console.error("Error loading notes:", error);
    }
}

const showData = async (resp) => {
    let items = ""

    resp.forEach((note) => {
        const { id, text, createdByUser } = note;
        items += `<div class="item" data-note='${JSON.stringify(note)}'>
                <div class="input-controller">
                  <textarea disabled>${text}</textarea>
                  <div class="edit-controller">
                    <i class="fa-solid fa-trash-alt deleteBtn"></i>
                    <i class="fa-solid fa-pencil-alt editBtn"></i>
                  </div>
                </div>
                <div class="update-controller">
                  <button class="saveBtn">Save</button>
                  <button class="cancelBtn">Cancel</button>
                </div>
              </div>`
    })
    document.querySelector(".notes-list").innerHTML = items
    activateDeleteListeners()
    activateEditListeners()
    activateSaveListeners()
    activateCancelListeners()
}

function activateDeleteListeners() {
    const deleteButtons = document.querySelectorAll(".deleteBtn");

    deleteButtons.forEach(deleteBtn => {
        deleteBtn.addEventListener("click", async function() {
            const itemElement = this.closest('.item');

            const note = JSON.parse(itemElement.dataset.note);

            if (confirm('Are you sure you want to delete?')) {
                try {
                    await deleteItem(note);
                    itemElement.remove();
                } catch (error) {
                    alert('Could not delete the note');
                }
            }
        });
    });
}

function activateEditListeners() {
    const editBtn = document.querySelectorAll(".editBtn")
    const updateController = document.querySelectorAll(".update-controller")
    const inputs = document.querySelectorAll(".input-controller textarea")
    editBtn.forEach((eB, i) => {
        eB.addEventListener("click", () => {
            updateController[i].style.display = "block"
            inputs[i].disabled = false
        })
    })
}

function activateSaveListeners() {
    const saveBtns = document.querySelectorAll(".saveBtn");

    saveBtns.forEach((saveBtn) => {
        saveBtn.addEventListener("click", async () => {
            const itemElement = saveBtn.closest('.item');

            const note = JSON.parse(itemElement.dataset.note);
            const textarea = itemElement.querySelector('textarea');
            note.text = textarea.value;

            try {
                await updateItem(note);

                itemElement.dataset.note = JSON.stringify(note);

                textarea.disabled = true;
                itemElement.querySelector('.update-controller').style.display = 'none';

                console.log('Заметка успешно обновлена');
            } catch (error) {
                console.error('Ошибка при обновлении заметки:', error);
                alert('Не удалось сохранить изменения');
            }
        });
    });
}

function activateCancelListeners() {
    const cancelBtn = document.querySelectorAll(".cancelBtn")
    const updateController = document.querySelectorAll(".update-controller")
    const inputs = document.querySelectorAll(".input-controller textarea")
    cancelBtn.forEach((cB, i) => {
        cB.addEventListener("click", () => {
            updateController[i].style.display = "none"
            inputs[i].disabled = true
            inputs[i].style.border = "none"
        })
    })
}

async function deleteItem(item) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        console.error('No token found, please log in');
        return;
    }

    try {
        const response = await fetch(`/notes/${item.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!response.ok) return new Error("Failed to delete note");

    } catch (error) {
        console.error("Error loading notes:", error);
    }
}

async function updateItem(item) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        console.error('No token found, please log in');
        return;
    }
    try {
        const response = await fetch(`/notes`, {
            method: "PUT",
            body: JSON.stringify({ id: item.id, text: item.text }),
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) return new Error("Failed to update note");

    } catch (error) {
        console.error("Error loading notes:", error);
    }
}

window.onload = async function () {
    await displayItems()
};


document.getElementById('notesForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const token = localStorage.getItem('auth_token');
    const username = localStorage.getItem('username');
    const itemInput = event.target.typename.value;
    const newItem = itemInput.trim();

    if (newItem) {
        try {
            const response = await fetch(`/notes`, {
                method: "POST",
                body: JSON.stringify({ text: newItem, createdByUser: username }),
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to create note");
        } catch (error) {
            console.error("Error creating note:", error);
        }
        await displayItems();
        event.target.typename.value = '';
    }
})

function showToast(eventData) {
    console.log(eventData)
    const toast = document.createElement('div');
    toast.className = `toast ${eventData.type.toLowerCase()}`;

    let message = '';
    switch(eventData.type) {
        case 'NOTE_CREATED':
            message = `Note successfully created ${eventData.note.text}`;
            break;
        case 'NOTE_UPDATED':
            message = `Note successfully updated`;
            break;
        case 'NOTE_DELETED':
            message = `Note successfully deleted`;
            break;
        default:
            message = `Event: ${eventData.type}`;
    }

    toast.innerHTML = `
      <div class="toast-content">${message}</div>
      <button class="toast-close">&times;</button>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);

    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    new SSENotifier({
        eventSourceUrl: '/sse',
        channel: 'notes',
        onMessage: (data) => {
            showToast(data);
        },
        eventListeners: {
            'note-deleted': (data) => console.log('Note deleted:', data),
        },
    });
});