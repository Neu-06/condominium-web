import { useEffect, useState } from "react";

export default function VisitanteForm({
  initialVisitante = null,
  residentes = [],
  onSubmit,
  onCancel,
  loading = false
}) {
  const editMode = !!initialVisitante;
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    dni: "",
    telefono: "",
    residente: "",
    hora_entrada: "",
    hora_salida: ""
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialVisitante) {
      setForm({
        nombre: initialVisitante.nombre || "",
        apellidos: initialVisitante.apellidos || "",
        dni: initialVisitante.dni || "",
        telefono: initialVisitante.telefono || "",
        residente: initialVisitante.residente || "",
        hora_entrada: initialVisitante.hora_entrada || "",
        hora_salida: initialVisitante.hora_salida || ""
      });
    } else {
      setForm({
        nombre: "",
        apellidos: "",
        dni: "",
        telefono: "",
        residente: "",
        hora_entrada: "",
        hora_salida: ""
      });
    }
  }, [initialVisitante]);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      nombre: true,
      apellidos: true,
      dni: true,
      residente: true
    });
    if (!form.nombre || !form.apellidos || !form.dni || !form.residente) return;

    const payload = {
      id: initialVisitante?.id,
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      dni: form.dni.trim(),
      telefono: form.telefono.trim(),
      residente: parseInt(form.residente),
      hora_entrada: form.hora_entrada || null,
      hora_salida: form.hora_salida || null
    };
    onSubmit(payload);
  }

  const invalid = {
    nombre: touched.nombre && !form.nombre,
    apellidos: touched.apellidos && !form.apellidos,
    dni: touched.dni && !form.dni,
    residente: touched.residente && !form.residente
  };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Editar Visitante" : "Nuevo Visitante"}
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
              {loading ? "Guardando..." : editMode ? "Guardar Cambios" : "Crear Visitante"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Nombre *"
            error={invalid.nombre && "Requerido"}
            children={
              <input
                value={form.nombre}
                onChange={e => setField("nombre", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, nombre: true }))}
                required
                disabled={loading}
                className={`input-base ${invalid.nombre ? "input-error" : ""}`}
                placeholder="Nombre del visitante"
              />
            }
          />
          <Field
            label="Apellidos *"
            error={invalid.apellidos && "Requerido"}
            children={
              <input
                value={form.apellidos}
                onChange={e => setField("apellidos", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, apellidos: true }))}
                required
                disabled={loading}
                className={`input-base ${invalid.apellidos ? "input-error" : ""}`}
                placeholder="Apellidos del visitante"
              />
            }
          />
          <Field
            label="DNI *"
            error={invalid.dni && "Requerido"}
            children={
              <input
                value={form.dni}
                onChange={e => setField("dni", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, dni: true }))}
                required
                disabled={loading}
                className={`input-base ${invalid.dni ? "input-error" : ""}`}
                placeholder="DNI del visitante"
              />
            }
          />
          <Field
            label="Teléfono"
            children={
              <input
                type="tel"
                value={form.telefono}
                onChange={e => setField("telefono", e.target.value)}
                disabled={loading}
                className="input-base"
                placeholder="Teléfono de contacto"
              />
            }
          />
          <Field
            label="Visitando a *"
            error={invalid.residente && "Requerido"}
            children={
              <select
                value={form.residente}
                onChange={e => setField("residente", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, residente: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.residente ? "input-error" : ""}`}
              >
                <option value="">Seleccionar residente</option>
                {residentes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.nombre} {r.apellidos} - Res. {r.residencia}
                  </option>
                ))}
              </select>
            }
          />
          <Field
            label="Hora de Entrada"
            children={
              <input
                type="datetime-local"
                value={form.hora_entrada}
                onChange={e => setField("hora_entrada", e.target.value)}
                disabled={loading}
                className="input-base"
              />
            }
          />
          <Field
            label="Hora de Salida"
            children={
              <input
                type="datetime-local"
                value={form.hora_salida}
                onChange={e => setField("hora_salida", e.target.value)}
                disabled={loading}
                className="input-base"
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