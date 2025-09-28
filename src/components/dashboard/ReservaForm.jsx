import { useEffect, useState } from "react";
import { api } from "../../services/apiClient";

const initialFormState = {
  residente_id: "",
  area_id: "",
  monto_total: "",
  descripcion: "",
  fecha_reserva: "",
  hora_inicio: "",
  hora_fin: "",
  estado: "pendiente",
};

export default function ReservaForm({ initialData = null, onSubmit, onCancel, loading = false }) {
  const editMode = !!initialData;
  const [form, setForm] = useState(initialFormState);
  const [areas, setAreas] = useState([]);
  const [residentes, setResidentes] = useState([]);
  const [touched, setTouched] = useState({
    residente_id: false,
    area_id: false,
    fecha_reserva: false,
  });

  useEffect(() => {
    api.get("/api/areas-comunes/").then(setAreas);
    api.get("/api/residentes/").then(setResidentes);
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialFormState,
        ...initialData,
        residente_id: initialData.residente?.id || initialData.residente_id || "",
        area_id: initialData.area?.id || initialData.area_id || "",
      });
    } else {
      setForm(initialFormState);
    }
  }, [initialData]);

  function submit(e) {
    e.preventDefault();
    setTouched({
      residente_id: true,
      area_id: true,
      fecha_reserva: true,
    });
    if (!form.residente_id || !form.area_id || !form.fecha_reserva) return;
    onSubmit(form);
  }

  const invalid = {
    residente_id: touched.residente_id && !form.residente_id,
    area_id: touched.area_id && !form.area_id,
    fecha_reserva: touched.fecha_reserva && !form.fecha_reserva,
  };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={submit} className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Editar Reserva" : "Nueva Reserva"}
          </h2>
          <div className="flex gap-3">
            <button type="button" onClick={onCancel} disabled={loading} className="px-5 py-2 rounded-xl border text-sm bg-white hover:bg-gray-50">Cancelar</button>
            <button disabled={loading} className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">
              {loading ? "Guardando..." : editMode ? "Guardar Cambios" : "Crear"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Residente *" error={invalid.residente_id && "Requerido"}>
            <select className={`input-base ${invalid.residente_id ? "input-error" : ""}`} value={form.residente_id} onChange={e => setForm(f => ({ ...f, residente_id: e.target.value }))} disabled={loading} onBlur={() => setTouched(t => ({ ...t, residente_id: true }))}>
              <option value="">Selecciona un residente</option>
              {residentes.map(r => <option key={r.id} value={r.id}>{r.nombre} {r.apellido}</option>)}
            </select>
          </Field>
          <Field label="Área común *" error={invalid.area_id && "Requerido"}>
            <select className={`input-base ${invalid.area_id ? "input-error" : ""}`} value={form.area_id} onChange={e => setForm(f => ({ ...f, area_id: e.target.value }))} disabled={loading} onBlur={() => setTouched(t => ({ ...t, area_id: true }))}>
              <option value="">Selecciona un área</option>
              {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </Field>
          <Field label="Fecha de reserva *" error={invalid.fecha_reserva && "Requerido"}>
            <input type="date" className={`input-base ${invalid.fecha_reserva ? "input-error" : ""}`} value={form.fecha_reserva} onChange={e => setForm(f => ({ ...f, fecha_reserva: e.target.value }))} disabled={loading} onBlur={() => setTouched(t => ({ ...t, fecha_reserva: true }))} />
          </Field>
          <Field label="Hora inicio">
            <input type="time" className="input-base" value={form.hora_inicio} onChange={e => setForm(f => ({ ...f, hora_inicio: e.target.value }))} disabled={loading} />
          </Field>
          <Field label="Hora fin">
            <input type="time" className="input-base" value={form.hora_fin} onChange={e => setForm(f => ({ ...f, hora_fin: e.target.value }))} disabled={loading} />
          </Field>
          <Field label="Monto total">
            <input type="number" className="input-base" value={form.monto_total} onChange={e => setForm(f => ({ ...f, monto_total: e.target.value }))} disabled={loading} />
          </Field>
          <Field label="Descripción">
            <textarea className="input-base" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} disabled={loading} />
          </Field>
          <Field label="Estado *">
            <select
              className="input-base"
              value={form.estado}
              onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
              disabled={loading}
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
              <option value="finalizada">Finalizada</option>
            </select>
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