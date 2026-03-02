/**
 * Muestra un mensaje en pantalla y lo oculta después de unos segundos.
 * @param {string} message - El texto a mostrar.
 * @param {boolean} isError - Determina si el estilo es de error o éxito.
 */
export function showMessage(message, isError = false) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.textContent = message;
    statusDiv.className = isError ? 'error' : 'success';
    statusDiv.classList.remove('hidden');

    setTimeout(() => {
        statusDiv.classList.add('hidden');
    }, 4000);
}

/**
 * Renderiza la lista de reseñas en el contenedor HTML.
 * @param {Array} resenas - Lista de objetos reseña.
 * @param {Function} onEdit - Callback que se ejecuta al presionar "Editar".
 * @param {Function} onDelete - Callback que se ejecuta al presionar "Eliminar".
 */
export function renderResenas(resenas, onEdit, onDelete) {
    const container = document.getElementById('resenasContainer');
    container.innerHTML = '';

    if (resenas.length === 0) {
        container.innerHTML = '<p>No hay reseñas para mostrar.</p>';
        return;
    }

    resenas.forEach(resena => {
        const card = document.createElement('div');
        card.className = 'resena-item';

        card.innerHTML = `
            <div class="resena-header">
                <h3>${resena.nombreJuego}</h3>
                <span class="badge-calificacion">⭐ ${resena.calificacion}/10</span>
            </div>
            <p>${resena.comentario}</p>
            <div class="resena-actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-danger btn-delete">Eliminar</button>
            </div>
        `;

        card.querySelector('.btn-edit').addEventListener('click', () => onEdit(resena));
        card.querySelector('.btn-delete').addEventListener('click', () => onDelete(resena.id));

        container.appendChild(card);
    });
}

/**
 * Rellena el formulario con los datos de una reseña para edición.
 * @param {Object} resena - El objeto reseña con los datos a editar.
 */
export function fillFormForEdit(resena) {
    document.getElementById('formTitle').textContent = 'Editar Reseña';
    document.getElementById('resenaId').value = resena.id;
    document.getElementById('nombreJuego').value = resena.nombreJuego;
    document.getElementById('calificacion').value = resena.calificacion;
    document.getElementById('comentario').value = resena.comentario;
    
    document.getElementById('btnCancel').classList.remove('hidden');
    document.getElementById('btnSubmit').textContent = 'Actualizar Reseña';
}

/**
 * Limpia el formulario y restablece su estado a "Creación".
 */
export function resetForm() {
    document.getElementById('resenaForm').reset();
    document.getElementById('resenaId').value = '';
    document.getElementById('formTitle').textContent = 'Agregar Nueva Reseña';
    document.getElementById('btnCancel').classList.add('hidden');
    document.getElementById('btnSubmit').textContent = 'Guardar Reseña';
}