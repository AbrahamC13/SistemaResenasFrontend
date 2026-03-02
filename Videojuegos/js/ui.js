/**
 * Muestra un mensaje en pantalla y lo oculta después de unos segundos.
 * @param {string} message
 * @param {boolean} isError
 */
export function showMessage(message, isError = false) {
  const statusDiv = document.getElementById("statusMessage");
  statusDiv.textContent = message;
  statusDiv.className = isError ? "error" : "success";
  statusDiv.classList.remove("hidden");

  setTimeout(() => {
    statusDiv.classList.add("hidden");
  }, 4000);
}

/**
 * Renderiza la lista de videojuegos.
 * @param {Array} videojuegos
 * @param {Function} onEdit
 * @param {Function} onDelete
 */
export function renderVideojuegos(videojuegos, onEditFull, onDelete, onPatchQuick, filterText = "") {
  const container = document.getElementById("videojuegosContainer");
  container.innerHTML = "";

  const text = (filterText || "").trim().toLowerCase();

  const filtered = !text
    ? videojuegos
    : videojuegos.filter(v => {
        const s = `${v.nombre || ""} ${v.genero || ""} ${v.plataforma || ""} ${v.anio ?? ""}`.toLowerCase();
        return s.includes(text);
      });

  if (!filtered || filtered.length === 0) {
    container.innerHTML = "<p style='color: rgba(233,238,252,.7); margin:0;'>No hay videojuegos para mostrar.</p>";
    return;
  }

  filtered.forEach(v => {
    const card = document.createElement("div");
    card.className = "item";

    const anioText = (v.anio === null || v.anio === undefined || v.anio === "") ? "N/A" : v.anio;

    card.innerHTML = `
      <div class="item-head">
        <h3>${escapeHtml(v.nombre)}</h3>
        <span class="badge">🎮 ${escapeHtml(String(anioText))}</span>
      </div>

      <p class="meta"><strong>Género:</strong> ${escapeHtml(v.genero || "-")}</p>
      <p class="meta"><strong>Plataforma:</strong> ${escapeHtml(v.plataforma || "-")}</p>

      <div class="item-actions">
        <button class="btn-secondary btn-edit-full">Editar completo</button>
        <button class="btn-secondary btn-quick">Editar rápido</button>
        <button class="btn-danger btn-delete">Eliminar</button>
      </div>

      <div class="inline-edit hidden">
        <div class="row">
          <div>
            <label>Nuevo nombre (opcional)</label>
            <input class="q-nombre" type="text" maxlength="120" placeholder="Deja vacío si no cambias nombre" />
          </div>
          <div>
            <label>Nuevo año (opcional)</label>
            <input class="q-anio" type="number" min="1950" max="2100" placeholder="Ej. 2020" />
          </div>
        </div>
        <div class="actions">
          <button class="btn-primary btn-save-quick">Guardar cambios</button>
          <button class="btn-secondary btn-cancel-quick">Cancelar</button>
        </div>
      </div>
    `;

    // acciones
    card.querySelector(".btn-edit-full").addEventListener("click", () => onEditFull(v));
    card.querySelector(".btn-delete").addEventListener("click", () => onDelete(v.id));

    const inline = card.querySelector(".inline-edit");
    card.querySelector(".btn-quick").addEventListener("click", () => {
      inline.classList.toggle("hidden");
    });

    card.querySelector(".btn-cancel-quick").addEventListener("click", () => {
      inline.classList.add("hidden");
      card.querySelector(".q-nombre").value = "";
      card.querySelector(".q-anio").value = "";
    });

    card.querySelector(".btn-save-quick").addEventListener("click", () => {
      const newNombre = card.querySelector(".q-nombre").value.trim();
      const newAnioRaw = card.querySelector(".q-anio").value;

      const patch = {};
      if (newNombre !== "") patch.nombre = newNombre;

      if (newAnioRaw !== "" && newAnioRaw !== null && newAnioRaw !== undefined) {
        const parsed = Number(newAnioRaw);
        if (Number.isInteger(parsed)) patch.anio = parsed;
        else patch.__invalidAnio = true;
      }

      onPatchQuick(v.id, patch, () => {
        inline.classList.add("hidden");
        card.querySelector(".q-nombre").value = "";
        card.querySelector(".q-anio").value = "";
      });
    });

    container.appendChild(card);
  });
}

/**
 * Rellena el formulario para edición.
 * @param {Object} videojuego
 */
export function fillFormForEdit(videojuego) {
  document.getElementById("formTitle").textContent = "Editar Videojuego";
  document.getElementById("videojuegoId").value = videojuego.id;

  document.getElementById("nombre").value = videojuego.nombre ?? "";
  document.getElementById("genero").value = videojuego.genero ?? "";
  document.getElementById("plataforma").value = videojuego.plataforma ?? "";
  document.getElementById("anio").value = (videojuego.anio ?? "") === null ? "" : (videojuego.anio ?? "");

  document.getElementById("btnCancel").classList.remove("hidden");
  document.getElementById("btnSubmit").textContent = "Actualizar Videojuego";

  clearFieldErrors();
}

/**
 * Resetea el formulario a modo "crear".
 */
export function resetForm() {
  document.getElementById("videojuegoForm").reset();
  document.getElementById("videojuegoId").value = "";
  document.getElementById("formTitle").textContent = "Agregar Nuevo Videojuego";
  document.getElementById("btnCancel").classList.add("hidden");
  document.getElementById("btnSubmit").textContent = "Guardar Videojuego";

  clearFieldErrors();
}

/**
 * Muestra un error de validación bajo un campo.
 * @param {string} fieldId
 * @param {string} message
 */
export function setFieldError(fieldId, message) {
  const map = {
    nombre: "nombreError",
    genero: "generoError",
    plataforma: "plataformaError",
    anio: "anioError"
  };

  const errorId = map[fieldId];
  if (!errorId) return;

  const el = document.getElementById(errorId);
  el.textContent = message;
  el.classList.remove("hidden");
}

/**
 * Limpia errores de validación.
 */
export function clearFieldErrors() {
  ["nombreError", "generoError", "plataformaError", "anioError"].forEach(id => {
    const el = document.getElementById(id);
    el.textContent = "";
    el.classList.add("hidden");
  });
}

/**
 * Escapa HTML básico para evitar inyección al renderizar.
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}