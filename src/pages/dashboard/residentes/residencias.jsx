import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import { api } from "../../../services/apiClient.js";
import ResidenciaForm from "../../../components/dashboard/ResidenciaForm.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";

export default function ResidenciasPage() {
  const [loading, setLoading] = useState(false);
  const [residencias, setResidencias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteResidencia, setDeleteResidencia] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    api.get("/api/residencias/")
      .then(response => {
        setResidencias(Array.isArray(response) ? response : []);
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
    const residencia = residencias.find(r => r.numero === row.numero);
    if (!residencia) return;
    setEditing(residencia);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveResidencia(data) {
    setLoading(true);
    // Usar el flag isEdit en lugar de verificar data.numero
    const isEdit = data.isEdit;
    const url = isEdit ? `/api/residencias/${data.numero}/` : "/api/residencias/";
    const method = isEdit ? api.put : api.post;
    
    // Remover el flag antes de enviar
    const payload = { ...data };
    delete payload.isEdit;
    
    method(url, payload)
      .then(() => {
        setShowForm(false);
        setEditing(null);
        cargar();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  function onDelete(row) {
    const residencia = residencias.find(r => r.numero === row.numero);
    if (!residencia) return;
    setDeleteResidencia(residencia);
  }

  function confirmDelete() {
    if (!deleteResidencia) return;
    setLoading(true);
    api.del(`/api/residencias/${deleteResidencia.numero}/`)
      .then(() => {
        setDeleteResidencia(null);
        cargar();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  const rows = residencias.map(r => ({
    numero: r.numero,
    direccion: r.direccion || '—',
    tipo: r.tipo || '—',
    num_habitaciones: r.num_habitaciones || 0,
    num_residentes: r.num_residentes || 0,
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <ResidenciaForm
          initialResidencia={editing}
          onSubmit={saveResidencia}
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
        titulo="Residencias"
        data={rows}
        loading={loading}
        columns={[
          { key: "numero", label: "Número", width: "100px", enableSort: true },
          { key: "direccion", label: "Dirección", enableSort: true },
          { key: "tipo", label: "Tipo", enableSort: true },
          { key: "num_habitaciones", label: "Habitaciones", width: "120px", enableSort: true },
          { key: "num_residentes", label: "Residentes", width: "120px", enableSort: true },
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteResidencia}
        title="Eliminar Residencia"
        message={`¿Seguro que deseas eliminar la residencia número "${deleteResidencia?.numero}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteResidencia(null)}
      />
    </div>
  );
}