import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";
import { api } from "../../../services/apiClient.js";

function ResidenteForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const editMode = !!initialData;
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    fecha_nacimiento: "",
    telefono: "",
    correo: "",
    dni: "",
    sexo: "",
    tipo: "",
    residencia: "",
    foto_perfil: "",
    activo: true,
  });
  const [touched, setTouched] = useState({});
  const [uploading, setUploading] = useState(false);
  const [fotoError, setFotoError] = useState("");
  const [residencias, setResidencias] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        nombre: initialData.nombre || "",
        apellidos: initialData.apellidos || "",
        fecha_nacimiento: initialData.fecha_nacimiento || "",
        telefono: initialData.telefono || "",
        correo: initialData.correo || "",
        dni: initialData.dni || "",
        sexo: initialData.sexo || "",
        tipo: initialData.tipo || "",
        residencia: initialData.residencia || "",
        foto_perfil: initialData.foto_perfil || "",
        activo: initialData.activo,
      });
    } else {
      setForm({
        nombre: "",
        apellidos: "",
        fecha_nacimiento: "",
        telefono: "",
        correo: "",
        dni: "",
        sexo: "",
        tipo: "",
        residencia: "",
        foto_perfil: "",
        activo: true,
      });
    }
  }, [initialData]);

  useEffect(() => {
    // Cargar residencias para el select
    api.get("/api/residencias/")
      .then(data => setResidencias(Array.isArray(data) ? data : []))
      .catch(() => setResidencias([]));
  }, []);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    setFotoError("");
    if (!file) {
      setFotoError("Selecciona una imagen.");
      return;
    }
    if (form.foto_perfil) {
      setFotoError("Solo una foto permitida.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");
    formData.append("folder", "fotoReferenciaCondominium");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dlhfdfu6l/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setField("foto_perfil", data.secure_url);
      } else {
        setFotoError("Error al subir.");
      }
    } catch {
      setFotoError("Error al subir.");
    } finally {
      setUploading(false);
    }
  }

  function handleDeleteImage() {
    setField("foto_perfil", "");
    setFotoError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      nombre: true,
      apellidos: true,
      dni: true,
      sexo: true,
      tipo: true,
    });
    if (
      !form.nombre ||
      !form.apellidos ||
      !form.dni ||
      !form.sexo ||
      !form.tipo
    )
      return;
    const payload = { ...form };
    if (editMode) payload.id = initialData.id;
    onSubmit(payload);
  }

  const invalid = {
    nombre: touched.nombre && !form.nombre,
    apellidos: touched.apellidos && !form.apellidos,
    dni: touched.dni && !form.dni,
    sexo: touched.sexo && !form.sexo,
    tipo: touched.tipo && !form.tipo,
  };

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white rounded-3xl border border-gray-200 shadow-xl p-8 flex flex-col gap-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Editar Residente" : "Nuevo Residente"}
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
              {loading
                ? "Guardando..."
                : editMode
                ? "Guardar Cambios"
                : "Crear Residente"}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Field
            label="Nombre *"
            error={invalid.nombre && "Requerido"}
            children={
              <input
                value={form.nombre}
                onChange={(e) => setField("nombre", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.nombre ? "input-error" : ""}`}
                placeholder="Nombre"
              />
            }
          />
          <Field
            label="Apellidos *"
            error={invalid.apellidos && "Requerido"}
            children={
              <input
                value={form.apellidos}
                onChange={(e) => setField("apellidos", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, apellidos: true }))}
                disabled={loading}
                required
                className={`input-base ${
                  invalid.apellidos ? "input-error" : ""
                }`}
                placeholder="Apellidos"
              />
            }
          />
          <Field
            label="Fecha Nacimiento"
            children={
              <input
                type="date"
                value={form.fecha_nacimiento}
                onChange={(e) => setField("fecha_nacimiento", e.target.value)}
                disabled={loading}
                className="input-base"
              />
            }
          />
          <Field
            label="Teléfono"
            children={
              <input
                value={form.telefono}
                onChange={(e) => setField("telefono", e.target.value)}
                disabled={loading}
                className="input-base"
                placeholder="Ej: 555..."
              />
            }
          />
          <Field
            label="Correo"
            children={
              <input
                type="email"
                value={form.correo}
                onChange={(e) => setField("correo", e.target.value)}
                disabled={loading}
                className="input-base"
                placeholder="correo@dominio.com"
              />
            }
          />
          <Field
            label="DNI *"
            error={invalid.dni && "Requerido"}
            children={
              <input
                value={form.dni}
                onChange={(e) => setField("dni", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, dni: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.dni ? "input-error" : ""}`}
                placeholder="Documento"
              />
            }
          />
          <Field
            label="Sexo *"
            error={invalid.sexo && "Requerido"}
            children={
              <select
                value={form.sexo}
                onChange={(e) => setField("sexo", e.target.value)}
                disabled={loading}
                required
                className={`input-base ${invalid.sexo ? "input-error" : ""}`}
              >
                <option value="">Selecciona</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            }
          />
          <Field
            label="Tipo *"
            error={invalid.tipo && "Requerido"}
            children={
              <select
                value={form.tipo}
                onChange={(e) => setField("tipo", e.target.value)}
                disabled={loading}
                required
                className={`input-base ${invalid.tipo ? "input-error" : ""}`}
              >
                <option value="">Selecciona</option>
                <option value="PROPIETARIO">Propietario</option>
                <option value="INQUILINO">Inquilino</option>
                <option value="FAMILIAR_PROPIETARIO">
                  Familiar Propietario
                </option>
                <option value="FAMILIAR_INQUILINO">Familiar Inquilino</option>
                <option value="OTRO">Otro</option>
              </select>
            }
          />
          <Field
            label="Residencia"
            children={
              <select
                value={form.residencia}
                onChange={e => setField("residencia", e.target.value)}
                disabled={loading}
                className="input-base"
              >
                <option value="">Selecciona</option>
                {residencias.map(r => (
                  <option key={r.numero} value={r.numero}>
                    {r.numero} - {r.direccion}
                  </option>
                ))}
              </select>
            }
          />
          <Field
            label="Foto Perfil"
            error={fotoError}
            children={
              <div>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploading || loading || !!form.foto_perfil}
                    className="hidden"
                    id="foto-perfil-input"
                  />
                  {uploading && (
                    <div className="text-xs text-blue-600 mt-1">
                      Subiendo...
                    </div>
                  )}
                  {!form.foto_perfil && !uploading && (
                    <span
                      className="inline-block px-4 py-2 bg-blue-50 border border-blue-300 rounded cursor-pointer text-blue-700 text-sm hover:bg-blue-100 transition"
                      htmlFor="foto-perfil-input"
                    >
                      Elija una foto
                    </span>
                  )}
                </label>

                {form.foto_perfil && (
                  <div className="flex flex-col items-start gap-2 mt-2">
                    <img
                      src={form.foto_perfil}
                      alt="Foto perfil"
                      className="rounded-lg w-24 h-24 object-cover border"
                    />
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      disabled={loading}
                      className="px-3 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600"
                    >
                      Quitar foto
                    </button>
                  </div>
                )}
              </div>
            }
          />
          <Field
            label="Activo"
            children={
              <div className="flex items-center gap-2 h-[46px] px-4 rounded-2xl border border-gray-300 bg-white">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) => setField("activo", e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700">
                  {form.activo ? "Sí" : "No"}
                </span>
              </div>
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

export default function ResidentesPage() {
  const [loading, setLoading] = useState(false);
  const [residentes, setResidentes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteResidente, setDeleteResidente] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    api
      .get("/api/residentes/") // <-- antes /api/residentes/residentes/
      .then((data) => setResidentes(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    cargar();
  }, []);

  function onCreate() {
    setEditing(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onEdit(row) {
    // Asegura que el id sea número y la URL tenga slash final
    const id = Number(row.id);
    const residente = residentes.find((r) => r.id === id);
    if (!residente) return;
    setEditing(residente);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveResidente(data) {
    setLoading(true);
    const isEdit = !!data.id;
    // Asegura que el id sea número y la URL tenga slash final
    const id = isEdit ? Number(data.id) : null;
    const url = isEdit ? `/api/residentes/${id}/` : "/api/residentes/";
    const method = isEdit ? api.put : api.post;
    method(url, data)
      .then(() => {
        setShowForm(false);
        setEditing(null);
        cargar();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  function onDelete(row) {
    const id = Number(row.id);
    const residente = residentes.find((r) => r.id === id);
    if (!residente) return;
    setDeleteResidente(residente);
  }

  function confirmDelete() {
    if (!deleteResidente) return;
    setLoading(true);
    const id = Number(deleteResidente.id);
    api
      .del(`/api/residentes/${id}/`)
      .then(() => {
        setDeleteResidente(null);
        cargar();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  const rows = residentes.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    apellidos: r.apellidos,
    dni: r.dni,
    tipo: r.tipo,
    sexo: r.sexo,
    residencia: r.residencia,
    activo: r.activo,
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <ResidenteForm
          initialData={editing}
          onSubmit={saveResidente}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          loading={loading}
        />
      )}

      {error && (
        <div className="px-4 py-2 rounded border border-red-200 bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <SmartTable
        titulo="Residentes"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "70px", enableSort: true },
          { key: "nombre", label: "Nombre", enableSort: true },
          { key: "apellidos", label: "Apellidos", enableSort: true },
          { key: "dni", label: "DNI", enableSort: true },
          { key: "tipo", label: "Tipo", enableSort: true },
          { key: "sexo", label: "Sexo", enableSort: true },
          { key: "residencia", label: "Residencia", enableSort: true },
          {
            key: "activo",
            label: "Estado",
            render: (row) => (
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  row.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {row.activo ? "Activo" : "Inactivo"}
              </span>
            ),
            width: "110px",
          },
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteResidente}
        title="Eliminar Residente"
        message={`¿Seguro que deseas eliminar "${deleteResidente?.nombre} ${deleteResidente?.apellidos}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteResidente(null)}
      />
    </div>
  );
}
