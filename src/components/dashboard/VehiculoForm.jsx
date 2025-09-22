import { useEffect, useState } from "react";

export default function VehiculoForm({
  initialVehiculo = null,
  residentes = [],
  onSubmit,
  onCancel,
  loading = false
}) {
  const editMode = !!initialVehiculo;
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    matricula: "",
    color: "",
    tipo: "",
    residente: ""
  });
  const [touched, setTouched] = useState({});

  const tipoOptions = [
    { value: "", label: "(Seleccionar tipo)" },
    { value: "COCHE", label: "Coche" },
    { value: "MOTO", label: "Moto" },
    { value: "BICICLETA", label: "Bicicleta" },
    { value: "OTRO", label: "Otro" }
  ];

  useEffect(() => {
    if (initialVehiculo) {
      setForm({
        marca: initialVehiculo.marca || "",
        modelo: initialVehiculo.modelo || "",
        matricula: initialVehiculo.matricula || "",
        color: initialVehiculo.color || "",
        tipo: initialVehiculo.tipo || "",
        residente: initialVehiculo.residente || ""
      });
    } else {
      setForm({
        marca: "",
        modelo: "",
        matricula: "",
        color: "",
        tipo: "",
        residente: ""
      });
    }
  }, [initialVehiculo]);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      marca: true,
      residente: true
    });
    if (!form.marca || !form.residente) return;

    const payload = {
      id: initialVehiculo?.id,
      marca: form.marca.trim(),
      modelo: form.modelo.trim(),
      matricula: form.matricula.trim(),
      color: form.color.trim(),
      tipo: form.tipo,
      residente: parseInt(form.residente)
    };
    onSubmit(payload);
  }

  const invalid = {
    marca: touched.marca && !form.marca,
    residente: touched.residente && !form.residente
  };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Editar Vehículo" : "Nuevo Vehículo"}
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
              {loading ? "Guardando..." : editMode ? "Guardar Cambios" : "Crear Vehículo"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Marca *"
            error={invalid.marca && "Requerido"}
            children={
              <input
                value={form.marca}
                onChange={e => setField("marca", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, marca: true }))}
                required
                disabled={loading}
                className={`input-base ${invalid.marca ? "input-error" : ""}`}
                placeholder="Marca del vehículo"
              />
            }
          />
          <Field
            label="Modelo"
            children={
              <input
                value={form.modelo}
                onChange={e => setField("modelo", e.target.value)}
                disabled={loading}
                className="input-base"
                placeholder="Modelo del vehículo"
              />
            }
          />
          <Field
            label="Matrícula"
            children={
              <input
                value={form.matricula}
                onChange={e => setField("matricula", e.target.value)}
                disabled={loading}
                className="input-base"
                placeholder="Matrícula del vehículo"
              />
            }
          />
          <Field
            label="Color"
            children={
              <input
                value={form.color}
                onChange={e => setField("color", e.target.value)}
                disabled={loading}
                className="input-base"
                placeholder="Color del vehículo"
              />
            }
          />
          <Field
            label="Tipo"
            children={
              <select
                value={form.tipo}
                onChange={e => setField("tipo", e.target.value)}
                disabled={loading}
                className="input-base"
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