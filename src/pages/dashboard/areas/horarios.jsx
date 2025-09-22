import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import { api } from "../../../services/apiClient.js";
import HorarioForm from "../../../components/dashboard/HorarioForm.jsx";
import TablaHorarios from "../../../components/tabla/TablaHorarios.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";

export default function HorariosPage() {
  const [loading, setLoading] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [areas, setAreas] = useState([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteHorario, setDeleteHorario] = useState(null);
  const [error, setError] = useState("");
  const [vistaTabla, setVistaTabla] = useState(false);

  function cargar() {
    setLoading(true);
    setError("");
    Promise.all([api.get("/api/horarios/"), api.get("/api/areas-comunes/")])
      .then(([horariosResponse, areasResponse]) => {
        setHorarios(Array.isArray(horariosResponse) ? horariosResponse : []);
        setAreas(Array.isArray(areasResponse) ? areasResponse : []);
      })
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
    const horario = horarios.find((h) => h.id === row.id);
    if (!horario) return;
    setEditing(horario);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveHorario(data) {
    setLoading(true);
    const isEdit = !!data.id;
    const url = isEdit ? `/api/horarios/${data.id}/` : "/api/horarios/";
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
    const horario = horarios.find((h) => h.id === row.id);
    if (!horario) return;
    setDeleteHorario(horario);
  }

  function confirmDelete() {
    if (!deleteHorario) return;
    setLoading(true);
    api
      .del(`/api/horarios/${deleteHorario.id}/`)
      .then(() => {
        setDeleteHorario(null);
        cargar();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  // Obtener horarios del área seleccionada
  const horariosDelArea = areaSeleccionada
    ? horarios.filter((h) => h.area === areaSeleccionada.id)
    : [];

  const rows = horarios.map((h) => {
    return {
      id: h.id,
      area: h.area_nombre || "Área desconocida", 
      dia_semana: h.dia_semana || "—",
      hora_apertura: h.hora_apertura || "—",
      hora_cierre: h.hora_cierre || "—",
      activo: h.activo ? "✅ Sí" : "❌ No",
    };
  });

  return (
    <div className="space-y-8">
      {showForm && (
        <HorarioForm
          areas={areas}
          initialHorario={editing}
          onSubmit={saveHorario}
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

      {/* Selector de vista y área */}
      <div className="bg-white rounded-xl shadow p-4 border">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => setVistaTabla(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                !vistaTabla
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              📋 Lista
            </button>
            <button
              onClick={() => setVistaTabla(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                vistaTabla
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              📅 Tabla semanal
            </button>
          </div>

          {vistaTabla && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Área:</label>
              <select
                value={areaSeleccionada?.id || ""}
                onChange={(e) => {
                  const area = areas.find(
                    (a) => a.id === parseInt(e.target.value)
                  );
                  setAreaSeleccionada(area || null);
                }}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">Seleccionar área</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {vistaTabla ? (
        areaSeleccionada ? (
          <TablaHorarios horarios={horariosDelArea} area={areaSeleccionada} />
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-600">
              Selecciona un área para ver la tabla de horarios
            </p>
          </div>
        )
      ) : (
        // Vista de lista normal
        <SmartTable
          titulo="Horarios"
          data={rows}
          loading={loading}
          columns={[
            { key: "id", label: "ID", width: "70px", enableSort: true },
            { key: "area", label: "Área", enableSort: true },
            { key: "dia_semana", label: "Día", enableSort: true },
            { key: "hora_apertura", label: "Apertura", enableSort: true },
            { key: "hora_cierre", label: "Cierre", enableSort: true },
            { key: "activo", label: "Activo", enableSort: true },
          ]}
          onCreate={onCreate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      <ConfirmDialog
        open={!!deleteHorario}
        title="Eliminar Horario"
        message={`¿Seguro que deseas eliminar el horario "${deleteHorario?.dia_semana}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteHorario(null)}
      />
    </div>
  );
}
