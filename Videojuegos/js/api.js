/**
 * URL base de la API de videojuegos.
 * Ajusta el puerto si tu API corre en otro.
 * @constant {string}
 */
const API_URL = "http://localhost:8081/videojuegos";

/**
 * Procesa la respuesta HTTP y lanza errores si el status no es OK.
 * @param {Response} response
 * @returns {Promise<any>}
 * @throws {Error}
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `Error HTTP: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.error) errorMessage = errorData.error;
    } catch (error) {
      console.error("Error al procesar la respuesta de error:", error);
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;
  return response.json();
}

/**
 * Obtiene todos los videojuegos mediante GET.
 * @returns {Promise<Array>}
 */
export async function getVideojuegos() {
  const urlWithoutCache = `${API_URL}?_t=${new Date().getTime()}`;
  const response = await fetch(urlWithoutCache, { method: "GET" });
  return handleResponse(response);
}

/**
 * Crea un videojuego mediante POST.
 * @param {{nombre:string, genero:string, plataforma:string, anio:number|null}} videojuego
 * @returns {Promise<Object>}
 */
export async function createVideojuego(videojuego) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(videojuego)
  });
  return handleResponse(response);
}

/**
 * Actualiza un videojuego mediante PUT.
 * @param {number|string} id
 * @param {{nombre:string, genero:string, plataforma:string, anio:number|null}} videojuego
 * @returns {Promise<Object>}
 */
export async function updateVideojuegoPut(id, videojuego) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(videojuego)
  });
  return handleResponse(response);
}

/**
 * Actualiza parcialmente un videojuego mediante PATCH.
 * Puedes mandar solo {nombre} o solo {anio} o ambos.
 * @param {number|string} id
 * @param {Object} partial
 * @returns {Promise<Object>}
 */
export async function updateVideojuegoPatch(id, partial) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(partial)
  });
  return handleResponse(response);
}

/**
 * Elimina un videojuego mediante DELETE.
 * @param {number|string} id
 * @returns {Promise<void>}
 */
export async function deleteVideojuego(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  return handleResponse(response);
}