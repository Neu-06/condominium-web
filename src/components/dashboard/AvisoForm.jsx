import { useEffect, useState } from "react";

export default function AvisoForm({ initialData = null, onSubmit, onCancel, loading = false }) {
  const editMode = !!initialData;
  const [form, setForm] = useState({
    asunto: "",
    mensaje: "",
    urgente: false,
    estado: "PENDIENTE",
    fecha_push: "",
    hora_push: "",
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        asunto: initialData.asunto || "",
        mensaje: initialData.mensaje || "",
        urgente: initialData.urgente || false,
        estado: initialData.estado || "PENDIENTE",
        fecha_push: initialData.fecha_push || "",
        hora_push: initialData.hora_push || "",
      });
    } else {
      setForm({
        asunto: "",
        mensaje: "",
        urgente: false,
        estado: "PENDIENTE",
        fecha_push: "",
        hora_push: "",
      });
    }
  }, [initialData]);

  function submit(e) {
    e.preventDefault();
    setTouched({ asunto: true, mensaje: true });
    if (!form.asunto || !form.mensaje) return;
    const payload = {
      asunto: form.asunto.trim(),
      mensaje: form.mensaje.trim(),
      urgente: form.urgente,
      estado: form.estado,
      fecha_push: form.fecha_push || null,
      hora_push: form.hora_push || null,
    };
    if (editMode) payload.id = initialData.id;
    onSubmit(payload);
  }

  const invalid = {
    asunto: touched.asunto && !form.asunto,
    mensaje: touched.mensaje && !form.mensaje,
  };

  return (
    <div className="w-full flex justify-center px-3">
      <form
        onSubmit={submit}
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8"
      >
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Editar Aviso" : "Nuevo Aviso"}
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
          <Field label="Asunto *" error={invalid.asunto && "Requerido"}>
            <input
              className={`input-base ${invalid.asunto ? "input-error" : ""}`}
              value={form.asunto}
              onChange={(e) =>
                setForm((f) => ({ ...f, asunto: e.target.value }))
              }
              onBlur={() => setTouched((t) => ({ ...t, asunto: true }))}
              disabled={loading}
              placeholder="Asunto del aviso"
            />
          </Field>
          <Field label="Urgente">
            <div className="flex items-center gap-2 h-[46px] px-4 rounded-2xl border border-gray-300 bg-white">
              <input
                type="checkbox"
                checked={form.urgente}
                onChange={(e) =>
                  setForm((f) => ({ ...f, urgente: e.target.checked }))
                }
                disabled={loading}
                className="w-4 h-4 accent-red-600"
              />
              <span className="text-sm">{form.urgente ? "Sí" : "No"}</span>
            </div>
          </Field>
          <Field label="Mensaje *" error={invalid.mensaje && "Requerido"}>
            <textarea
              className={`input-base h-32 resize-y ${
                invalid.mensaje ? "input-error" : ""
              }`}
              value={form.mensaje}
              onChange={(e) =>
                setForm((f) => ({ ...f, mensaje: e.target.value }))
              }
              onBlur={() => setTouched((t) => ({ ...t, mensaje: true }))}
              disabled={loading}
              placeholder="Mensaje del aviso"
            />
          </Field>
          <Field label="Estado">
            <select
              className="input-base"
              value={form.estado}
              onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
              disabled={loading}
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="ENVIADO">Enviado</option>
              <option value="FALLIDO">Fallido</option>
            </select>
          </Field>
          <Field label="Fecha de envío">
            <input
              type="date"
              className="input-base"
              value={form.fecha_push || ""}
              onChange={e => setForm(f => ({ ...f, fecha_push: e.target.value }))}
              disabled={loading}
            />
          </Field>
          <Field label="Hora de envío">
            <input
              type="time"
              className="input-base"
              value={form.hora_push || ""}
              onChange={e => setForm(f => ({ ...f, hora_push: e.target.value }))}
              disabled={loading}
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