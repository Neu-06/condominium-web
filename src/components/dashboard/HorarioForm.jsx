import React, { useState, useEffect } from "react";

export default function HorarioForm({ 
  areas = [], 
  initialHorario = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) {
  const editMode = !!initialHorario;
  const [form, setForm] = useState({
    area: "", 
    dia_semana: "",
    hora_apertura: "",
    hora_cierre: "",
    activo: true
  });
  const [touched, setTouched] = useState({});

  const diasSemana = [
    { value: "Lunes", label: "Lunes" },
    { value: "Martes", label: "Martes" },
    { value: "Miércoles", label: "Miércoles" },
    { value: "Jueves", label: "Jueves" },
    { value: "Viernes", label: "Viernes" },
    { value: "Sábado", label: "Sábado" },
    { value: "Domingo", label: "Domingo" }
  ];

  useEffect(() => {
    if (initialHorario) {
      setForm({
        area: initialHorario.area || "",
        dia_semana: initialHorario.dia_semana || "",
        hora_apertura: initialHorario.hora_apertura || "",
        hora_cierre: initialHorario.hora_cierre || "",
        activo: initialHorario.activo ?? true
      });
    } else {
      setForm({
        area: "",
        dia_semana: "",
        hora_apertura: "",
        hora_cierre: "",
        activo: true
      });
    }
  }, [initialHorario]);

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      area: true,
      dia_semana: true,
      hora_apertura: true,
      hora_cierre: true
    });
    
    if (!form.area || !form.dia_semana || !form.hora_apertura || !form.hora_cierre) return;
    
    if (form.hora_apertura >= form.hora_cierre) {
      alert("La hora de apertura debe ser menor a la hora de cierre");
      return;
    }

    const payload = {
      area: parseInt(form.area), // Convertir a número
      dia_semana: form.dia_semana,
      hora_apertura: form.hora_apertura,
      hora_cierre: form.hora_cierre,
      activo: form.activo
    };
    
    if (editMode) payload.id = initialHorario.id;
    onSubmit(payload);
  }

  const invalid = {
    area: touched.area && !form.area,
    dia_semana: touched.dia_semana && !form.dia_semana,
    hora_apertura: touched.hora_apertura && !form.hora_apertura,
    hora_cierre: touched.hora_cierre && !form.hora_cierre
  };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800">
            {editMode ? "Editar Horario" : "Nuevo Horario"}
          </h2>
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onCancel} 
              disabled={loading}
              className="px-4 py-2 rounded-xl border text-sm bg-white hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Guardando..." : editMode ? "Guardar" : "Crear"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field 
            label="Área *" 
            error={invalid.area && "Requerido"}
          >
            <select
              value={form.area}
              onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
              onBlur={() => setTouched(t => ({ ...t, area: true }))}
              disabled={loading}
              className={`input-base ${invalid.area ? "input-error" : ""}`}
            >
              <option value="">Seleccionar área</option>
              {areas.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </Field>

          <Field 
            label="Día de la semana *" 
            error={invalid.dia_semana && "Requerido"}
          >
            <select
              value={form.dia_semana}
              onChange={e => setForm(f => ({ ...f, dia_semana: e.target.value }))}
              onBlur={() => setTouched(t => ({ ...t, dia_semana: true }))}
              disabled={loading}
              className={`input-base ${invalid.dia_semana ? "input-error" : ""}`}
            >
              <option value="">Seleccionar día</option>
              {diasSemana.map(dia => (
                <option key={dia.value} value={dia.value}>
                  {dia.label}
                </option>
              ))}
            </select>
          </Field>

          <Field 
            label="Hora de apertura *" 
            error={invalid.hora_apertura && "Requerido"}
          >
            <input
              type="time"
              value={form.hora_apertura}
              onChange={e => setForm(f => ({ ...f, hora_apertura: e.target.value }))}
              onBlur={() => setTouched(t => ({ ...t, hora_apertura: true }))}
              disabled={loading}
              className={`input-base ${invalid.hora_apertura ? "input-error" : ""}`}
            />
          </Field>

          <Field 
            label="Hora de cierre *" 
            error={invalid.hora_cierre && "Requerido"}
          >
            <input
              type="time"
              value={form.hora_cierre}
              onChange={e => setForm(f => ({ ...f, hora_cierre: e.target.value }))}
              onBlur={() => setTouched(t => ({ ...t, hora_cierre: true }))}
              disabled={loading}
              className={`input-base ${invalid.hora_cierre ? "input-error" : ""}`}
            />
          </Field>

          <Field label="Activo">
            <div className="flex items-center gap-2 h-[46px] px-4 rounded-2xl border border-gray-300 bg-white">
              <input 
                type="checkbox" 
                checked={form.activo} 
                onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} 
                disabled={loading} 
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm">{form.activo ? "Sí" : "No"}</span>
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
      <label className="text-xs font-semibold tracking-wide text-gray-600">
        {label}
      </label>
      {children}
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}