"use strict";

const ui = {
    userForm: document.getElementById('userForm'),
    usernameInput: document.getElementById('usernameInput'),
    passwordInput: document.getElementById('passwordInput'),
    btnSubmit: document.getElementById('btnSubmit'),
    btnCancel: document.getElementById('btnCancel'),
    usersTableBody: document.getElementById('usersTableBody'),
    statusMessage: document.getElementById('statusMessage')
};

const API_URL = 'http://localhost:8089/usuarios';

function showMessage(text, isError = false) {
    ui.statusMessage.textContent = text;
    ui.statusMessage.className = `statusMessage ${isError ? 'error' : 'success'}`;
    ui.statusMessage.classList.remove('hidden');
    
    setTimeout(() => {
        ui.statusMessage.classList.add('hidden');
    }, 4000);
}

async function loadUsers() {
    try {
        const response = await fetch(API_URL, { method: 'GET' });
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const users = await response.json();
        renderTable(users);
    } catch (error) {
        showMessage("No se pudieron cargar los usuarios: " + error.message, true);
    }
}

function renderTable(usersList) {
    ui.usersTableBody.innerHTML = ''; 

    usersList.forEach(user => {
        const tr = document.createElement('tr');
        const estado = user.activo ? 'Activo' : 'Suspendido';
        
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nombre}</td>
            <td><strong>${estado}</strong></td>
            <td style="display: flex; gap: 5px;">
                <button class="btnWarning" onclick="prepareEdit('${user.nombre}')"> Seleccionar</button>
                ${user.activo ? `<button class="btnWarning" onclick="suspendUser('${user.nombre}')"> Suspender</button>` : ''}
                <button class="btnDanger" onclick="deleteUser('${user.nombre}')">🗑 Borrar</button>
            </td>
        `;
        ui.usersTableBody.appendChild(tr);
    });
}

ui.userForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = ui.usernameInput.value.trim();
    const password = ui.passwordInput.value.trim();

    if (password === '') {
        return showMessage("La nueva contraseña es obligatoria", true);
    }

    try {
        const response = await fetch(`${API_URL}/cambiarContrasena`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: username, nuevaContraseña: password })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage("Contraseña actualizada con éxito");
            resetForm();
        } else {
            showMessage(data.error || "Ocurrió un error", true);
        }

    } catch (error) {
        showMessage("Error de conexión con el servidor", true);
    }
});

window.suspendUser = async (username) => {
    if (!confirm(`¿Estás seguro de suspender a ${username}?`)) return;

    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: username })
        });
        
        if (response.ok) {
            showMessage(`Usuario ${username} suspendido`);
            loadUsers();
        } else {
            const data = await response.json();
            showMessage(data.error, true);
        }
    } catch (error) {
        showMessage("Error de conexión", true);
    }
};

window.deleteUser = async (username) => {
    if (!confirm(`¿Eliminar definitivamente a ${username}?`)) return;

    try {
        const response = await fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: username })
        });

        if (response.ok) {
            showMessage(`Usuario ${username} eliminado`);
            loadUsers();
            if (ui.usernameInput.value === username) resetForm(); 
        } else {
            const data = await response.json();
            showMessage(data.error, true);
        }
    } catch (error) {
        showMessage("Error de conexión", true);
    }
};

window.prepareEdit = (username) => {
    ui.usernameInput.value = username;
    ui.passwordInput.disabled = false;
    ui.btnSubmit.disabled = false;
    
    ui.passwordInput.value = '';
    ui.passwordInput.focus();
    ui.btnCancel.classList.remove('hidden');
};

function resetForm() {
    ui.userForm.reset();
    ui.passwordInput.disabled = true;
    ui.btnSubmit.disabled = true;  
    ui.btnCancel.classList.add('hidden');
}

ui.btnCancel.addEventListener('click', resetForm);

document.addEventListener('DOMContentLoaded', loadUsers);