import { useEffect, useState } from "react";

export default function ResidenciaForm({
  initialResidencia = null,
  onSubmit,
  onCancel,
  loading = false
}) {
  const editMode = !!initialResidencia;
  const [form, setForm] = useState({
    numero: "",
    direccion: "",
    tipo: "",
    num_habitaciones: 1,
    num_residentes: 0
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialResidencia) {
      setForm({
        numero: initialResidencia.numero || "",
        direccion: initialResidencia.direccion || "",
        tipo: initialResidencia.tipo || "",
        num_habitaciones: initialResidencia.num_habitaciones || 1,
        num_residentes: initialResidencia.num_residentes || 0
      });
    } else {
      setForm({
        numero: "",
        direccion: "",
        tipo: "",
        num_habitaciones: 1,
        num_residentes: 0
      });
    }
  }, [initialResidencia]);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      numero: true,
      direccion: true,
      tipo: true
    });
    if (!form.numero || !form.direccion || !form.tipo) return;

    const payload = {
      numero: parseInt(form.numero),
      direccion: form.direccion.trim(),
      tipo: form.tipo,
      num_habitaciones: parseInt(form.num_habitaciones) || 1,
      num_residentes: parseInt(form.num_residentes) || 0,
      // Agregar flag para determinar si es edición
      isEdit: editMode
    };
    onSubmit(payload);
  }

  const invalid = {
    numero: touched.numero && !form.numero,
    direccion: touched.direccion && !form.direccion,
    tipo: touched.tipo && !form.tipo
  };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Editar Residencia" : "Nueva Residencia"}
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow disabled:opacity-60"
            >
              {loading ? "Guardando..." : editMode ? "Guardar Cambios" : "Crear Residencia"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Número *"
            error={invalid.numero && "Requerido"}
            children={
              <input
                type="number"
                value={form.numero}
                onChange={e => setField("numero", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, numero: true }))}
                disabled={loading || editMode} // Deshabilitar en edición
                required
                className={`input-base ${invalid.numero ? "input-error" : ""}`}
                placeholder="Número de residencia"
              />
            }
          />
          <Field
            label="Dirección *"
            error={invalid.direccion && "Requerido"}
            children={
              <input
                value={form.direccion}
                onChange={e => setField("direccion", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, direccion: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.direccion ? "input-error" : ""}`}
                placeholder="Dirección de la residencia"
              />
            }
          />
          <Field
            label="Tipo *"
            error={invalid.tipo && "Requerido"}
            children={
              <select
                value={form.tipo}
                onChange={e => setField("tipo", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, tipo: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.tipo ? "input-error" : ""}`}
              >
                <option value="">Seleccionar tipo</option>
                <option value="APARTAMENTO">Apartamento</option>
                <option value="CASA">Casa</option>
              </select>
            }
          />
          <Field
            label="Número de Habitaciones"
            children={
              <input
                type="number"
                min="1"
                value={form.num_habitaciones}
                onChange={e => setField("num_habitaciones", e.target.value)}
                disabled={loading}
                className="input-base"
                placeholder="1"
              />
            }
          />
          <Field
            label="Número de Residentes"
            children={
              <input
                type="number"
                min="0"
                value={form.num_residentes}
                onChange={e => setField("num_residentes", e.target.value)}
                disabled={loading}
                className="input-base"
                placeholder="0"
              />
            }
          />
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-wide text-gray-600">
        {label}
      </label>
      {children}
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}