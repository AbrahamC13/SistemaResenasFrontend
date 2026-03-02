import * as api from "./api.js";
import * as ui from "./ui.js";

/**
 * Inicializa la aplicación cargando los datos.
 */
async function init() {
    await loadResenas();
    setupEventListeners();
}

/**
 * Obtiene los datos de la API y le indica a la UI que los muestre.
 */
async function loadResenas() {
    try {
        const resenas = await api.getResenas();
        ui.renderResenas(resenas, handleEditClick, handleDeleteClick);
    } catch (error) {
        console.error(error);
        ui.showMessage(`No se pudieron cargar las reseñas: ${error.message}`, true);
    }
}

/**
 * Configura los eventos del formulario.
 */
function setupEventListeners() {
    const form = document.getElementById('resenaForm');
    const btnCancel = document.getElementById('btnCancel');

    form.addEventListener('submit', handleFormSubmit);
    btnCancel.addEventListener('click', () => {
        ui.resetForm();
    });
}

/**
 * Maneja el evento Submit diferenciando entre POST y PUT.
 * @param {Event} event 
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('resenaId').value;

    const resenaData = {
        nombreJuego: document.getElementById('nombreJuego').value.trim(),
        calificacion: Number(document.getElementById('calificacion').value),
        comentario: document.getElementById('comentario').value.trim()
    };

    try {
        if (id) {
            await api.updateResena(id, resenaData);
            ui.showMessage('Reseña actualizada exitosamente.');
        } else {
            await api.createResena(resenaData);
            ui.showMessage('Reseña creada exitosamente.');
        }
        ui.resetForm();
        await loadResenas();
    } catch (error) {
        console.error(error);
        ui.showMessage(`Error al guardar la reseña: ${error.message}`, true);
    }
}

/**
 * Callback ejecutado cuando se hace clic en "Editar" en una tarjeta.
 * @param {Object} resena - Datos de la reseña seleccionada. 
 */
function handleEditClick(resena) {
    ui.fillFormForEdit(resena);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Callback ejecutado cuando se hace clic en "Eliminar" en una tarjeta.
 * @param {number} id - ID de la reseña a eliminar. 
 */
async function handleDeleteClick(id) {
    const confirmar = confirm('¿Estás seguro de que deseas eliminar esta reseña? Esta acción no se puede deshacer.');

    if (confirmar) {
        try {
            await api.deleteResena(id);
            ui.showMessage('Reseña eliminada exitosamente.');
            await loadResenas();
        } catch (error) {
            console.error(error);
            ui.showMessage(`Error al eliminar la reseña: ${error.message}`, true);
        }
    }
}

document.addEventListener("DOMContentLoaded", init);