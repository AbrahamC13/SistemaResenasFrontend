/**
 * URL base de la API de reseñas.
 * @constant {string}
 */
const API_URL = 'http://localhost:8081/resenas';

/**
 * Procesa la respuesta HTTP y lanza errores si el status no es OK.
 * @param {Response} response - La respuesta de fetch.
 * @returns {Promise<any>} Los datos en formato JSON.
 * @throws {Error} Si el código HTTP indica un fallo (404, 500, etc.).
 */
async function handleResponse(response) {
    if (!response.ok) {
        let errorMessage = `Error HTTP: ${response.status}`;
        try {
            const errorData = await response.json();
            if (errorData.error) {
                errorMessage = errorData.error;
            }
        } catch (error) {
            console.error("Error al procesar la respuesta de error:", error);
        }
        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return null;
    }
    return response.json();
}

/**
 * Obtiene todas las reseñas mediante GET.
 * @returns {Promise<Array>} Lista de reseñas.
 */
export async function getResenas() {
    const urlWithoutCache = `${API_URL}?_t=${new Date().getTime()}`;
    const response = await fetch(urlWithoutCache, {
        method: 'GET'
    });
    return handleResponse(response);
}

/**
 * Crea una nueva reseña mediante POST.
 * @param {Object} resena - Objeto con nombreJuego, calificacion y comentario.
 * @returns {Promise<Object>} La reseña creada.
 */
export async function createResena(resena) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resena)
    });
    return handleResponse(response);
}

/**
 * Actualiza una reseña existente mediante PUT.
 * @param {number} id - ID de la reseña.
 * @param {Object} resena - Objeto con los datos actualizados.
 * @returns {Promise<Object>} La reseña actualizada.
 */
export async function updateResena(id, resena) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resena)
    });
    return handleResponse(response);
}

/**
 * Elimina una reseña mediante DELETE.
 * @param {number} id - ID de la reseña a eliminar.
 * @returns {Promise<void>} No retorna datos.
 */
export async function deleteResena(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    return handleResponse(response);
}