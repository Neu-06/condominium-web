import { useEffect, useState } from "react";

export default function MascotaForm({
  initialMascota = null,
  residentes = [],
  onSubmit,
  onCancel,
  loading = false
}) {
  const editMode = !!initialMascota;
  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    raza: "",
    residente: ""
  });
  const [touched, setTouched] = useState({});

  const tipoOptions = [
    { value: "", label: "Seleccionar tipo" },
    { value: "PERRO", label: "Perro" },
    { value: "GATO", label: "Gato" },
    { value: "OTRO", label: "Otro" }
  ];

  useEffect(() => {
    if (initialMascota) {
      setForm({
        nombre: initialMascota.nombre || "",
        tipo: initialMascota.tipo || "",
        raza: initialMascota.raza || "",
        residente: initialMascota.residente ? initialMascota.residente.toString() : ""
      });
    } else {
      setForm({
        nombre: "",
        tipo: "",
        raza: "",
        residente: ""
      });
    }
  }, [initialMascota]);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      nombre: true,
      tipo: true,
      residente: true
    });
    if (!form.nombre || !form.tipo || !form.residente) return;

    const payload = {
      nombre: form.nombre.trim(),
      tipo: form.tipo,
      raza: form.raza.trim() || "",
      residente: parseInt(form.residente),
      // Agregar información para determinar si es edición
      isEdit: editMode,
      id: initialMascota?.id
    };
    onSubmit(payload);
  }

  const invalid = {
    nombre: touched.nombre && !form.nombre,
    tipo: touched.tipo && !form.tipo,
    residente: touched.residente && !form.residente
  };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Editar Mascota" : "Nueva Mascota"}
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
              {loading ? "Guardando..." : editMode ? "Guardar Cambios" : "Crear Mascota"}
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
                placeholder="Nombre de la mascota"
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
                required
                disabled={loading}
                className={`input-base ${invalid.tipo ? "input-error" : ""}`}
              >
                {tipoOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            }
          />
          <Field
            label="Raza"
            children={
              <input
                value={form.raza}
                onChange={e => setField("raza", e.target.value)}
                disabled={loading}
                className="input-base"
                placeholder="Raza de la mascota"
              />
            }
          />
          <Field
            label="Propietario *"
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