import * as api from "./api.js";
import * as ui from "./ui.js";

let cached = [];
let currentFilter = "";

async function init() {
  setupEventListeners();
  await loadVideojuegos();
}

async function loadVideojuegos() {
  try {
    cached = await api.getVideojuegos();
    ui.renderVideojuegos(cached, handleEditClick, handleDeleteClick, handleQuickPatch, currentFilter);
  } catch (error) {
    console.error(error);
    ui.showMessage(`No se pudieron cargar los videojuegos: ${error.message}`, true);
  }
}

function setupEventListeners() {
  const form = document.getElementById("videojuegoForm");
  const btnCancel = document.getElementById("btnCancel");
  const btnReload = document.getElementById("btnReload");
  const search = document.getElementById("searchInput");

  form.addEventListener("submit", handleFormSubmit);
  btnCancel.addEventListener("click", () => ui.resetForm());

  btnReload.addEventListener("click", async () => {
    await loadVideojuegos();
    ui.showMessage("Catálogo recargado.");
  });

  if (search) {
    search.addEventListener("input", () => {
      currentFilter = search.value;
      ui.renderVideojuegos(cached, handleEditClick, handleDeleteClick, handleQuickPatch, currentFilter);
    });
  }
}

// igual que antes
function buildAndValidatePayload() {
  ui.clearFieldErrors();

  const nombre = document.getElementById("nombre").value.trim();
  const genero = document.getElementById("genero").value.trim();
  const plataforma = document.getElementById("plataforma").value.trim();
  const anioRaw = document.getElementById("anio").value;

  let ok = true;

  if (!nombre) {
    ui.setFieldError("nombre", "El nombre es obligatorio.");
    ok = false;
  }

  let anio = null;
  if (anioRaw !== "" && anioRaw !== null && anioRaw !== undefined) {
    const parsed = Number(anioRaw);
    if (!Number.isInteger(parsed)) {
      ui.setFieldError("anio", "El año debe ser un número entero.");
      ok = false;
    } else {
      anio = parsed;
    }
  }

  if (!ok) return { ok: false };

  return { ok: true, data: { nombre, genero, plataforma, anio } };
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const id = document.getElementById("videojuegoId").value;
  const payload = buildAndValidatePayload();

  if (!payload.ok) {
    ui.showMessage("Revisa los campos marcados.", true);
    return;
  }

  try {
    if (id) {
      await api.updateVideojuegoPut(id, payload.data);
      ui.showMessage("Videojuego actualizado (PUT) exitosamente.");
    } else {
      await api.createVideojuego(payload.data);
      ui.showMessage("Videojuego creado exitosamente.");
    }

    ui.resetForm();
    await loadVideojuegos();
  } catch (error) {
    console.error(error);
    ui.showMessage(`Error al guardar el videojuego: ${error.message}`, true);
  }
}

function handleEditClick(videojuego) {
  ui.fillFormForEdit(videojuego);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function handleDeleteClick(id) {
  const confirmar = confirm("¿Eliminar este videojuego? Esta acción no se puede deshacer.");
  if (!confirmar) return;

  try {
    await api.deleteVideojuego(id);
    ui.showMessage("Videojuego eliminado exitosamente.");
    await loadVideojuegos();
  } catch (error) {
    console.error(error);
    ui.showMessage(`Error al eliminar: ${error.message}`, true);
  }
}

/**
 * PATCH rápido: solo nombre y/o año.
 */
async function handleQuickPatch(id, patch, onDone) {
  // validaciones mínimas del patch
  if (patch.__invalidAnio) {
    ui.showMessage("El año debe ser un número entero.", true);
    return;
  }

  // Si no mandó nada, no hacemos request
  const keys = Object.keys(patch).filter(k => !k.startsWith("__"));
  if (keys.length === 0) {
    ui.showMessage("No hay cambios para guardar.", true);
    return;
  }

  // extra validación: nombre si viene, no vacío
  if (patch.nombre !== undefined && (typeof patch.nombre !== "string" || patch.nombre.trim() === "")) {
    ui.showMessage("El nombre debe ser texto válido.", true);
    return;
  }

  try {
    await api.updateVideojuegoPatch(id, patch);
    ui.showMessage("Cambios guardados (PATCH) exitosamente.");
    if (typeof onDone === "function") onDone();
    await loadVideojuegos();
  } catch (error) {
    console.error(error);
    ui.showMessage(`Error al actualizar: ${error.message}`, true);
  }
}

document.addEventListener("DOMContentLoaded", init);