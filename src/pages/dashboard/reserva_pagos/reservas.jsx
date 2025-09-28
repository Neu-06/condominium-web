import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";
import { api } from "../../../services/apiClient.js";
import ReservaForm from "../../../components/dashboard/ReservaForm.jsx";

export default function ReservasPage() {
  const [loading, setLoading] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    api
      .get("/api/reservas/")
      .then((a) => setReservas(Array.isArray(a) ? a : []))
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
    const reserva = reservas.find((a) => a.id === row.id);
    if (!reserva) return;
    setEditing(reserva);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function save(reservaData) {
    setLoading(true);
    const isEdit = !!reservaData.id;
    const url = isEdit
      ? `/api/reservas/${reservaData.id}/`
      : "/api/reservas/";
    const method = isEdit ? api.put : api.post;

    // Asegúrate de enviar todos los campos requeridos y con el tipo correcto
    const payload = {
      ...reservaData,
      residente_id: parseInt(reservaData.residente_id, 10),
      area_id: parseInt(reservaData.area_id, 10),
      monto_total: reservaData.monto_total ? parseFloat(reservaData.monto_total) : 0,
      descripcion: reservaData.descripcion || "",
      fecha_reserva: reservaData.fecha_reserva || "",
      hora_inicio: reservaData.hora_inicio || null,
      hora_fin: reservaData.hora_fin || null,
      estado: reservaData.estado || "pendiente",
    };

    method(url, payload)
      .then(() => {
        setShowForm(false);
        setEditing(null);
        cargar();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  function onDelete(row) {
    const reserva = reservas.find((a) => a.id === row.id);
    if (!reserva) return;
    setDeleteItem(reserva);
  }
  function confirmDelete() {
    if (!deleteItem) return;
    setLoading(true);
    api
      .del(`/api/reservas/${deleteItem.id}/`)
      .then(() => {
        setDeleteItem(null);
        cargar();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  const rows = reservas.map((a) => ({
    id: a.id,
    residente: a.residente?.nombre + " " + (a.residente?.apellido || ""),
    area: a.area?.nombre,
    fecha: a.fecha_reserva,
    hora_inicio: a.hora_inicio,
    hora_fin: a.hora_fin,
    monto_total: a.monto_total,
    estado: a.estado,
    descripcion: a.descripcion,
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <ReservaForm
          initialData={editing}
          onSubmit={save}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          loading={loading}
        />
      )}

      {error && (
        <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      <SmartTable
        titulo="Reservas"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "60px", enableSort: true },
          { key: "residente", label: "Residente" },
          { key: "area", label: "Área" },
          { key: "fecha", label: "Fecha" },
          { key: "hora_inicio", label: "Hora inicio" },
          { key: "hora_fin", label: "Hora fin" },
          { key: "monto_total", label: "Monto" },
          { key: "estado", label: "Estado" },
          { key: "descripcion", label: "Descripción", width: "200px" },
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteItem}
        title="Eliminar Reserva"
        message={`¿Eliminar reserva de "${deleteItem?.residente}" en "${deleteItem?.area}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}