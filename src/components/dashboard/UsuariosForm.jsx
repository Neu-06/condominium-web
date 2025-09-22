import { useEffect, useState } from "react";

export default function AccountForm({
  initialUser = null,
  roles = [],
  residentes = [],
  personal = [],
  onSubmit,
  onCancel,
  loading = false
}) {
  const editMode = !!initialUser;
  const [form, setForm] = useState({
    correo: "",
    password: "",
    nombre: "",
    apellido: "",
    telefono: "",
    rol_id: "",
    residente: "",
    personal: "",
    is_active: true
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialUser) {
      setForm({
        correo: initialUser.correo || "",
        password: "",
        nombre: initialUser.nombre || "",
        apellido: initialUser.apellido || "",
        telefono: initialUser.telefono || "",
        rol_id: initialUser.rol ? initialUser.rol.id : "",
        residente: initialUser.residente || "",
        personal: initialUser.personal || "",
        is_active: initialUser.is_active
      });
    } else {
      setForm({
        correo: "",
        password: "",
        nombre: "",
        apellido: "",
        telefono: "",
        rol_id: "",
        residente: "",
        personal: "",
        is_active: true
      });
    }
  }, [initialUser]);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      correo: true,
      password: true,
      nombre: true,
      apellido: true
    });
    if (!form.correo || (!editMode && !form.password) || !form.nombre || !form.apellido) return;
    
    const payload = {
      id: initialUser?.id,
      correo: form.correo.trim(),
      password: form.password.trim(),
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      telefono: form.telefono.trim(),
      rol_id: form.rol_id || null,
      residente: form.residente || null,
      personal: form.personal || null,
      is_active: form.is_active
    };
    if (editMode && !payload.password) delete payload.password;
    onSubmit(payload);
  }

  const invalid = {
    correo: touched.correo && !form.correo,
    password: touched.password && !editMode && !form.password,
    nombre: touched.nombre && !form.nombre,
    apellido: touched.apellido && !form.apellido
  };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Editar Usuario" : "Nuevo Usuario"}
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
              {loading ? "Guardando..." : editMode ? "Guardar Cambios" : "Crear Usuario"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Correo *"
            error={invalid.correo && "Requerido"}
            children={
              <input
                type="email"
                value={form.correo}
                onChange={e => setField("correo", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, correo: true }))}
                disabled={loading || editMode} // correo no editable (opcional)
                required
                className={`input-base ${invalid.correo ? "input-error" : ""}`}
                placeholder="correo@dominio.com"
              />
            }
          />
          <Field
            label={editMode ? "Password (opcional)" : "Password *"}
            error={invalid.password && "Requerido"}
            children={
              <input
                type="password"
                value={form.password}
                onChange={e => setField("password", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                disabled={loading}
                className={`input-base ${invalid.password ? "input-error" : ""}`}
                placeholder={editMode ? "Dejar vacío si no cambia" : "********"}
              />
            }
          />
          <Field
            label="Nombre *"
            error={invalid.nombre && "Requerido"}
            children={
              <input
                value={form.nombre}
                onChange={e => setField("nombre", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, nombre: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.nombre ? "input-error" : ""}`}
                placeholder="Nombre"
              />
            }
          />
          <Field
            label="Apellido *"
            error={invalid.apellido && "Requerido"}
            children={
              <input
                value={form.apellido}
                onChange={e => setField("apellido", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, apellido: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.apellido ? "input-error" : ""}`}
                placeholder="Apellido"
              />
            }
          />
          <Field
            label="Teléfono"
            children={
              <input
                value={form.telefono}
                onChange={e => setField("telefono", e.target.value)}
                disabled={loading}
                className="input-base"
                placeholder="Ej: 555..."
              />
            }
          />
          <Field
            label="Rol"
            children={
              <select
                value={form.rol_id}
                onChange={e => setField("rol_id", e.target.value)}
                disabled={loading}
                className="input-base"
              >
                <option value="">(Sin rol)</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            }
          />

          <Field
            label="Residente"
            children={
              <select
                value={form.residente}
                onChange={e => {
                  setField("residente", e.target.value);
                  if (e.target.value) setField("personal", ""); // Limpiar personal si selecciona residente
                }}
                disabled={loading}
                className="input-base"
              >
                <option value="">(Sin residente)</option>
                {residentes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.nombre} {r.apellidos} - Residencia {r.residencia}
                  </option>
                ))}
              </select>
            }
          />

          <Field
            label="Personal"
            children={
              <select
                value={form.personal}
                onChange={e => {
                  setField("personal", e.target.value);
                  if (e.target.value) setField("residente", ""); // Limpiar residente si selecciona personal
                }}
                disabled={loading}
                className="input-base"
              >
                <option value="">(Sin personal)</option>
                {personal.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} - {p.cargo}
                  </option>
                ))}
              </select>
            }
          />

          <Field
            label="Activo"
            children={
              <div className="flex items-center gap-2 h-[46px] px-4 rounded-2xl border border-gray-300 bg-white">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={e => setField("is_active", e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700">
                  {form.is_active ? "Sí" : "No"}
                </span>
              </div>
            }
          />
        </div>

        {/* Nota informativa */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <strong>Nota:</strong> Solo puedes asignar una cuenta a un residente O a personal, no a ambos.
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
