const ui= {
    registerForm: document.getElementById('registerForm'),
    usernameInput: document.getElementById('usernameInput'),
    passwordInput: document.getElementById('passwordInput'),
    statusMessage: document.getElementById('statusMessage')
}

const API_URL = 'http://localhost:8089/usuarios';

ui.registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    ui.statusMessage.textContent = "Procesando...";
    ui.statusMessage.style.color = "black";

    const newUser = {
        nombre: ui.usernameInput.value.trim(),
        contraseña: ui.passwordInput.value.trim()
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
            ui.statusMessage.textContent = "¡Registro exitoso! Usuario creado.";
            ui.statusMessage.style.color = "green";
            ui.registerForm.reset();
        } else {
            ui.statusMessage.textContent = `Error: ${data.error}`;
            ui.statusMessage.style.color = "red";
        }

    } catch (error) {
        console.error('Error in request:', error);
        ui.statusMessage.textContent = "Error grave: No se pudo conectar con el servidor.";
        ui.statusMessage.style.color = "red";
    }
});