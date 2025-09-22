import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import { api } from "../../../services/apiClient.js";
import VisitanteForm from "../../../components/dashboard/VisitanteForm.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";

export default function VisitantesPage() {
  const [loading, setLoading] = useState(false);
  const [visitantes, setVisitantes] = useState([]);
  const [residentes, setResidentes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteVisitante, setDeleteVisitante] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    Promise.all([
      api.get("/api/visitantes/"),
      api.get("/api/residentes/")
    ])
      .then(([visitantesResponse, residentesResponse]) => {
        setVisitantes(Array.isArray(visitantesResponse) ? visitantesResponse : []);
        setResidentes(Array.isArray(residentesResponse) ? residentesResponse : []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { cargar(); }, []);

  function onCreate() {
    setEditing(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onEdit(row) {
    const visitante = visitantes.find(v => v.id === row.id);
    if (!visitante) return;
    setEditing(visitante);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveVisitante(data) {
    setLoading(true);
    const isEdit = !!data.id;
    const url = isEdit ? `/api/visitantes/${data.id}/` : "/api/visitantes/";
    const method = isEdit ? api.put : api.post;
    method(url, data)
      .then(() => {
        setShowForm(false);
        setEditing(null);
        cargar();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  function onDelete(row) {
    const visitante = visitantes.find(v => v.id === row.id);
    if (!visitante) return;
    setDeleteVisitante(visitante);
  }

  function confirmDelete() {
    if (!deleteVisitante) return;
    setLoading(true);
    api.del(`/api/visitantes/${deleteVisitante.id}/`)
      .then(() => {
        setDeleteVisitante(null);
        cargar();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  function formatDateTime(dateTime) {
    if (!dateTime) return '—';
    return new Date(dateTime).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const rows = visitantes.map(v => ({
    id: v.id,
    nombre_completo: `${v.nombre || ''} ${v.apellidos || ''}`.trim() || '—',
    dni: v.dni || '—',
    telefono: v.telefono || '—',
    fecha_visita: formatDateTime(v.fecha_visita),
    hora_entrada: formatDateTime(v.hora_entrada),
    hora_salida: formatDateTime(v.hora_salida)
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <VisitanteForm
          initialVisitante={editing}
          residentes={residentes}
          onSubmit={saveVisitante}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          loading={loading}
        />
      )}

      {error && (
        <div className="px-4 py-2 rounded border border-red-200 bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <SmartTable
        titulo="Visitantes"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "70px", enableSort: true },
          { key: "nombre_completo", label: "Nombre Completo", enableSort: true },
          { key: "dni", label: "DNI", enableSort: true },
          { key: "telefono", label: "Teléfono", enableSort: true },
          { key: "fecha_visita", label: "Fecha Visita", enableSort: true },
          { key: "hora_entrada", label: "Entrada", enableSort: true },
          { key: "hora_salida", label: "Salida", enableSort: true }
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteVisitante}
        title="Eliminar Visitante"
        message={`¿Seguro que deseas eliminar "${deleteVisitante?.nombre} ${deleteVisitante?.apellidos}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteVisitante(null)}
      />
    </div>
  );
}