import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import { api } from "../../../services/apiClient.js";
import MascotaForm from "../../../components/dashboard/MascotaForm.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";

export default function MascotasPage() {
  const [loading, setLoading] = useState(false);
  const [mascotas, setMascotas] = useState([]);
  const [residentes, setResidentes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteMascota, setDeleteMascota] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    Promise.all([
      api.get("/api/mascotas/"),
      api.get("/api/residentes/")
    ])
      .then(([mascotasResponse, residentesResponse]) => {
        setMascotas(Array.isArray(mascotasResponse) ? mascotasResponse : []);
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
    const mascota = mascotas.find(m => m.id === row.id);
    if (!mascota) return;
    setEditing(mascota);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveMascota(data) {
    setLoading(true);
    const isEdit = data.isEdit;
    const url = isEdit ? `/api/mascotas/${data.id}/` : "/api/mascotas/";
    const method = isEdit ? api.put : api.post;
    
    // Remover flags antes de enviar
    const payload = { ...data };
    delete payload.isEdit;
    if (!isEdit) delete payload.id;
    
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
    const mascota = mascotas.find(m => m.id === row.id);
    if (!mascota) return;
    setDeleteMascota(mascota);
  }

  function confirmDelete() {
    if (!deleteMascota) return;
    setLoading(true);
    api.del(`/api/mascotas/${deleteMascota.id}/`)
      .then(() => {
        setDeleteMascota(null);
        cargar();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  const rows = mascotas.map(m => ({
    id: m.id,
    nombre: m.nombre || '—',
    tipo: m.tipo || '—',
    raza: m.raza || '—'
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <MascotaForm
          initialMascota={editing}
          residentes={residentes}
          onSubmit={saveMascota}
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
        titulo="Mascotas"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "70px", enableSort: true },
          { key: "nombre", label: "Nombre", enableSort: true },
          { key: "tipo", label: "Tipo", enableSort: true },
          { key: "raza", label: "Raza", enableSort: true }
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteMascota}
        title="Eliminar Mascota"
        message={`¿Seguro que deseas eliminar "${deleteMascota?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteMascota(null)}
      />
    </div>
  );
}