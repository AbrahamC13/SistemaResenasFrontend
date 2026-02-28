"use strict";

const ui = {
    loginForm: document.getElementById('loginForm'),
    usernameInput: document.getElementById('usernameInput'),
    passwordInput: document.getElementById('passwordInput'),
    statusMessage: document.getElementById('statusMessage')
}

const API_URL = 'http://localhost:8089/usuarios';

ui.loginForm.addEventListener('submit', async (event) => {

    event.preventDefault(); 

    const inputUsername = ui.usernameInput.value.trim();
    const inputPassword = ui.passwordInput.value.trim();

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
                ui.statusMessage.textContent = "¡Inicio de sesión exitoso! Redirigiendo...";
                ui.statusMessage.style.color = "green";
                
                localStorage.setItem('loggedUser', JSON.stringify(foundUser));

                setTimeout(() => {
                    window.location.href = "../../Index/index.html"; 
                }, 1000);

            } else {
                ui.statusMessage.textContent = "Error: Esta cuenta se encuentra suspendida.";
                ui.statusMessage.style.color = "orange";
            }
        } else {
            ui.statusMessage.textContent = "Error: Usuario o contraseña incorrectos.";
            ui.statusMessage.style.color = "red";
        }

    } catch (error) {
        console.error('Error in request:', error);
        ui.statusMessage.textContent = "Error grave: No se pudo conectar con el servidor.";
        ui.statusMessage.style.color = "red";
    }
});