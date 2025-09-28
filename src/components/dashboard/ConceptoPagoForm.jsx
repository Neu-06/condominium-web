import { useState, useEffect } from "react";

export default function ConceptoPagoForm({ initialData = null, onSubmit, onCancel, loading = false }) {
  const editMode = !!initialData;
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    monto: "",
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) setForm({
      id: initialData.id || null,
      nombre: initialData.nombre || "",
      monto: initialData.monto || ""
    });
    else setForm({ id: null, nombre: "", monto: "" });
  }, [initialData]);

  function submit(e) {
    e.preventDefault();
    setTouched({ nombre: true, monto: true });
    if (!form.nombre || !form.monto) return;
    // Incluye el id si existe (para editar)
    onSubmit({ ...form, monto: parseFloat(form.monto) });
  }

  const invalid = { nombre: touched.nombre && !form.nombre, monto: touched.monto && !form.monto };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={submit} className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">{editMode ? "Editar Concepto" : "Nuevo Concepto"}</h2>
          <div className="flex gap-3">
            <button type="button" onClick={onCancel} disabled={loading} className="px-5 py-2 rounded-xl border text-sm bg-white hover:bg-gray-50">Cancelar</button>
            <button disabled={loading} className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">
              {loading ? "Guardando..." : editMode ? "Guardar Cambios" : "Crear"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Nombre *" error={invalid.nombre && "Requerido"}>
            <input className={`input-base ${invalid.nombre ? "input-error" : ""}`} value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              onBlur={() => setTouched(t => ({ ...t, nombre: true }))}
              disabled={loading}
              placeholder="Nombre del concepto"
            />
          </Field>
          <Field label="Monto *" error={invalid.monto && "Requerido"}>
            <input className={`input-base ${invalid.monto ? "input-error" : ""}`} type="number" min="0" step="0.01"
              value={form.monto}
              onChange={e => setForm(f => ({ ...f, monto: e.target.value }))}
              onBlur={() => setTouched(t => ({ ...t, monto: true }))}
              disabled={loading}
              placeholder="Monto"
            />
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