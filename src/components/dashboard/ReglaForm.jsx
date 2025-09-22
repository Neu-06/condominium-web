import { useEffect, useState } from "react";

export default function ReglaForm({
  initialData = null,
  areas = [],
  onSubmit,
  onCancel,
  loading = false,
}) {
  const editMode = !!initialData;
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    activo: true,
    areasSeleccionadas: [],
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        activo: initialData.activo,
        areasSeleccionadas:
          initialData.areas_ids || initialData.areas_ids === 0
            ? initialData.areas_ids || []
            : (initialData.areas || []).map((a) => a.id),
      });
    } else {
      setForm({
        nombre: "",
        descripcion: "",
        activo: true,
        areasSeleccionadas: [],
      });
    }
  }, [initialData]);

  function toggleArea(id) {
    setForm((f) => {
      const exists = f.areasSeleccionadas.includes(id);
      return {
        ...f,
        areasSeleccionadas: exists
          ? f.areasSeleccionadas.filter((x) => x !== id)
          : [...f.areasSeleccionadas, id],
      };
    });
  }

  function submit(e) {
    e.preventDefault();
    setTouched({ nombre: true });
    if (!form.nombre) return;
    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      activo: form.activo,
      areas_ids: form.areasSeleccionadas,
    };
    if (editMode) payload.id = initialData.id;
    onSubmit(payload);
  }

  const invalid = { nombre: touched.nombre && !form.nombre };

  return (
    <div className="w-full flex justify-center px-3">
      <form
        onSubmit={submit}
        className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8"
      >
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Editar Regla" : "Nueva Regla"}
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-5 py-2 rounded-xl border text-sm bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              disabled={loading}
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
            >
              {loading
                ? "Guardando..."
                : editMode
                ? "Guardar Cambios"
                : "Crear"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Nombre *" error={invalid.nombre && "Requerido"}>
            <input
              className={`input-base ${invalid.nombre ? "input-error" : ""}`}
              value={form.nombre}
              onChange={(e) =>
                setForm((f) => ({ ...f, nombre: e.target.value }))
              }
              onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
              disabled={loading}
            />
          </Field>
          <Field label="Activo">
            <div className="flex items-center gap-2 h-[46px] px-4 rounded-2xl border border-gray-300 bg-white">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, activo: e.target.checked }))
                }
                disabled={loading}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm">{form.activo ? "Sí" : "No"}</span>
            </div>
          </Field>
          <Field label="Descripción">
            <textarea
              className="input-base h-32 resize-y"
              value={form.descripcion}
              onChange={(e) =>
                setForm((f) => ({ ...f, descripcion: e.target.value }))
              }
              disabled={loading}
            />
          </Field>
          <Field label="Áreas (opcional)">
            <div className="max-h-40 overflow-auto border rounded-2xl p-2 flex flex-col gap-1">
              {areas.length === 0 && (
                <span className="text-xs text-gray-400 px-1">No hay áreas</span>
              )}
              {areas.map((a) => (
                <label
                  key={a.id}
                  className="flex items-center gap-2 text-xs px-2 py-1 rounded hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    disabled={loading}
                    checked={form.areasSeleccionadas.includes(a.id)}
                    onChange={() => toggleArea(a.id)}
                    className="accent-blue-600"
                  />
                  <span>{a.nombre}</span>
                </label>
              ))}
            </div>
          </Field>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      {children}
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}
