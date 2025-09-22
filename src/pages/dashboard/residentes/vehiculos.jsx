import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import { api } from "../../../services/apiClient.js";
import VehiculoForm from "../../../components/dashboard/VehiculoForm.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";

export default function VehiculosPage() {
  const [loading, setLoading] = useState(false);
  const [vehiculos, setVehiculos] = useState([]);
  const [residentes, setResidentes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteVehiculo, setDeleteVehiculo] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    Promise.all([
      api.get("/api/vehiculos/"),
      api.get("/api/residentes/")
    ])
      .then(([vehiculosResponse, residentesResponse]) => {
        setVehiculos(Array.isArray(vehiculosResponse) ? vehiculosResponse : []);
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
    const vehiculo = vehiculos.find(v => v.id === row.id);
    if (!vehiculo) return;
    setEditing(vehiculo);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveVehiculo(data) {
    setLoading(true);
    const isEdit = !!data.id;
    const url = isEdit ? `/api/vehiculos/${data.id}/` : "/api/vehiculos/";
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
    const vehiculo = vehiculos.find(v => v.id === row.id);
    if (!vehiculo) return;
    setDeleteVehiculo(vehiculo);
  }

  function confirmDelete() {
    if (!deleteVehiculo) return;
    setLoading(true);
    api.del(`/api/vehiculos/${deleteVehiculo.id}/`)
      .then(() => {
        setDeleteVehiculo(null);
        cargar();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  const rows = vehiculos.map(v => ({
    id: v.id,
    marca: v.marca || '—',
    modelo: v.modelo || '—',
    matricula: v.matricula || '—',
    color: v.color || '—',
    tipo: v.tipo || '—'
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <VehiculoForm
          initialVehiculo={editing}
          residentes={residentes}
          onSubmit={saveVehiculo}
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
        titulo="Vehículos"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "70px", enableSort: true },
          { key: "marca", label: "Marca", enableSort: true },
          { key: "modelo", label: "Modelo", enableSort: true },
          { key: "matricula", label: "Matrícula", enableSort: true },
          { key: "color", label: "Color", enableSort: true },
          { key: "tipo", label: "Tipo", enableSort: true }
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteVehiculo}
        title="Eliminar Vehículo"
        message={`¿Seguro que deseas eliminar el vehículo "${deleteVehiculo?.marca} ${deleteVehiculo?.modelo}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteVehiculo(null)}
      />
    </div>
  );
}