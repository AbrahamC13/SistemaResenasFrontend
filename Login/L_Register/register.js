"use strict";

const ui= {
    registerForm: document.getElementById('registerForm'),
    usernameInput: document.getElementById('usernameInput'),
    passwordInput: document.getElementById('passwordInput'),
    confirmPasswordInput: document.getElementById('confirmPasswordInput'),
    statusMessage: document.getElementById('statusMessage')
}

const API_URL = 'http://localhost:8089/usuarios';

ui.registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const inputUsername = ui.usernameInput.value.trim();
    const inputPassword = ui.passwordInput.value.trim();
    const inputConfirm = ui.confirmPasswordInput.value.trim();

    if (!validatePasswords(inputPassword, inputConfirm)) {
        return; 
    }

    showMessage("Procesando...", "black");

    const newUser = {
        nombre: inputUsername,
        contraseña: inputPassword
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(newUser) 
        });

        const data = await response.json();

        if (response.ok) {
            showMessage("¡Registro exitoso! Usuario creado.", "green");
            ui.registerForm.reset();
        } else {
            showMessage(`Error: ${data.error}`, "red");
        }

    } catch (error) {
        console.error('Error in request:', error);
        showMessage("Error grave: No se pudo conectar con el servidor.", "red");
    }
});

function validatePasswords(password, confirm) {
    if (password !== confirm) {
        showMessage("Error: Las contraseñas no coinciden.", "red");
        ui.confirmPasswordInput.value = ''; 
        return false;
    }
    return true;
}

function showMessage(text, color) {
    ui.statusMessage.textContent = text;
    ui.statusMessage.style.color = color;
}