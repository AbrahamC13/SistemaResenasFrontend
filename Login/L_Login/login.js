"use strict";

const ui = {
    loginForm: document.getElementById('loginForm'),
    usernameInput: document.getElementById('usernameInput'),
    passwordInput: document.getElementById('passwordInput'),
    statusMessage: document.getElementById('statusMessage'),
    btnManageUsers: document.getElementById('btnManageUsers')
}

const API_URL = 'http://localhost:8089/usuarios';

ui.loginForm.addEventListener('submit', async (event) => {

    event.preventDefault(); 

    const inputUsername = ui.usernameInput.value.trim();
    const inputPassword = ui.passwordInput.value.trim();

    showMessage("Validando credenciales...", "black");

    try {
        const response = await fetch(API_URL, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error("No se pudo obtener la lista de usuarios.");
        }

        const usersList = await response.json();

        const foundUser = usersList.find(user => 
            user.nombre === inputUsername && user.contraseña === inputPassword
        );

        if (foundUser) {
            if (foundUser.activo) {
                showMessage("¡Inicio de sesión exitoso! Redirigiendo...", "green");
                
                localStorage.setItem('loggedUser', JSON.stringify(foundUser));

                setTimeout(() => {
                    window.location.href = "../../Index/index.html"; 
                }, 1000);

            } else {
                showMessage("Error: Esta cuenta se encuentra suspendida.", "orange");
            }
        } else {
            showMessage("Error: Usuario o contraseña incorrectos.", "red");
        }

    } catch (error) {
        console.error('Error in request:', error);
        showMessage("Error grave: No se pudo conectar con el servidor.", "red");
    }
});

ui.btnManageUsers.addEventListener('click', () => {
    window.location.href = "../L_Users/user.html"; 
});

function showMessage(text, color) {
    ui.statusMessage.textContent = text;
    ui.statusMessage.style.color = color;
}