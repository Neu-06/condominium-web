import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";
import { api } from "../../../services/apiClient.js";
import ConceptoPagoForm from "../../../components/dashboard/ConceptoPagoForm.jsx";

export default function ConceptosPagoPage() {
  const [loading, setLoading] = useState(false);
  const [conceptos, setConceptos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    api
      .get("/api/conceptos-pago/")
      .then((a) => setConceptos(Array.isArray(a) ? a : []))
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
    const concepto = conceptos.find((a) => a.id === row.id);
    if (!concepto) return;
    setEditing(concepto);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function save(conceptoData) {
    setLoading(true);
    const isEdit = !!conceptoData.id;
    const url = isEdit
      ? `/api/conceptos-pago/${conceptoData.id}/`
      : "/api/conceptos-pago/";
    const method = isEdit ? api.put : api.post;
    method(url, conceptoData)
      .then(() => {
        setShowForm(false);
        setEditing(null);
        cargar();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  function onDelete(row) {
    const concepto = conceptos.find((a) => a.id === row.id);
    if (!concepto) return;
    setDeleteItem(concepto);
  }
  function confirmDelete() {
    if (!deleteItem) return;
    setLoading(true);
    api
      .del(`/api/conceptos-pago/${deleteItem.id}/`)
      .then(() => {
        setDeleteItem(null);
        cargar();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  const rows = conceptos.map((a) => ({
    id: a.id,
    nombre: a.nombre,
    monto: a.monto,
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <ConceptoPagoForm
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
        titulo="Conceptos de Pago"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "60px", enableSort: true },
          { key: "nombre", label: "Nombre" },
          { key: "monto", label: "Monto" },
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteItem}
        title="Eliminar Concepto"
        message={`¿Eliminar concepto "${deleteItem?.nombre}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}