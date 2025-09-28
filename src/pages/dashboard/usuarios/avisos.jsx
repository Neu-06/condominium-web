import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";
import { api } from "../../../services/apiClient.js";
import AvisoForm from "../../../components/dashboard/AvisoForm.jsx";

export default function AvisosPage() {
  const [loading, setLoading] = useState(false);
  const [avisos, setAvisos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    api
      .get("/api/cuenta/avisos/")
      .then((a) => setAvisos(Array.isArray(a) ? a : []))
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
    const aviso = avisos.find((a) => a.id === row.id);
    if (!aviso) return;
    setEditing(aviso);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function save(avisoData) {
    setLoading(true);
    const isEdit = !!avisoData.id;
    const url = isEdit
      ? `/api/cuenta/avisos/${avisoData.id}/`
      : "/api/cuenta/avisos/";
    const method = isEdit ? api.put : api.post;
    method(url, avisoData)
      .then(() => {
        setShowForm(false);
        setEditing(null);
        cargar();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  function onDelete(row) {
    const aviso = avisos.find((a) => a.id === row.id);
    if (!aviso) return;
    setDeleteItem(aviso);
  }
  function confirmDelete() {
    if (!deleteItem) return;
    setLoading(true);
    api
      .del(`/api/cuenta/avisos/${deleteItem.id}/`)
      .then(() => {
        setDeleteItem(null);
        cargar();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  const rows = avisos.map((a) => ({
    id: a.id,
    asunto: a.asunto,
    mensaje: a.mensaje,
    urgente: a.urgente,
    estado: a.estado,
    fecha: a.fecha_push?.slice(0, 10) || "",
    hora: a.hora_push || "",
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <AvisoForm
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
        titulo="Avisos"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "60px", enableSort: true },
          { key: "asunto", label: "Asunto", enableSort: true },
          {
            key: "urgente",
            label: "Urgente",
            render: (r) => (
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  r.urgente
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {r.urgente ? "Sí" : "No"}
              </span>
            ),
            width: "80px",
          },
          {
            key: "estado",
            label: "Estado",
            render: (r) => (
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  r.estado === "ENVIADO"
                    ? "bg-green-100 text-green-700"
                    : r.estado === "FALLIDO"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {r.estado}
              </span>
            ),
            width: "100px",
          },
          {
            key: "fecha",
            label: "Fecha",
            width: "100px",
          },
          {
            key: "hora",
            label: "Hora",
            width: "80px",
          },
          {
            key: "mensaje",
            label: "Mensaje",
            render: (r) => (
              <span className="text-xs line-clamp-2">{r.mensaje}</span>
            ),
            width: "250px",
          },
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteItem}
        title="Eliminar Aviso"
        message={`¿Eliminar aviso "${deleteItem?.asunto}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}