import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";
import { api } from "../../../services/apiClient.js";
import FacturaForm from "../../../components/dashboard/FacturaForm.jsx";

export default function FacturasPage() {
  const [loading, setLoading] = useState(false);
  const [facturas, setFacturas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    api
      .get("/api/facturas/")
      .then((a) => setFacturas(Array.isArray(a) ? a : []))
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
    const factura = facturas.find((a) => a.id === row.id);
    if (!factura) return;
    setEditing(factura);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function save(facturaData) {
    setLoading(true);
    const isEdit = !!facturaData.id;
    const url = isEdit ? `/api/facturas/${facturaData.id}/` : "/api/facturas/";
    const method = isEdit ? api.put : api.post;
    
    method(url, facturaData)
      .then((response) => {
        if (!isEdit) {
          // ✅ IMPORTANTE: Después de crear, activa modo edición para agregar detalles
          setEditing(response);  // response tiene la factura con su ID
          // NO cerrar el formulario, mantenerlo abierto para agregar detalles
          // setShowForm(false);  ❌ No hagas esto
        } else {
          setShowForm(false);
          setEditing(null);
        }
        cargar();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  function onDelete(row) {
    const factura = facturas.find((a) => a.id === row.id);
    if (!factura) return;
    setDeleteItem(factura);
  }
  function confirmDelete() {
    if (!deleteItem) return;
    setLoading(true);
    api
      .del(`/api/facturas/${deleteItem.id}/`)
      .then(() => {
        setDeleteItem(null);
        cargar();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  const rows = facturas.map((a) => ({
    id: a.id,
    residente: a.residente?.nombre || "Sin residente",
    descripcion: a.descripcion,
    fecha_emision: a.fecha_emision,
    fecha_limite: a.fecha_limite,
    estado: a.estado,
    monto_total: `$${a.monto_total}`,
    detalles: a.detalles?.length || 0,
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <FacturaForm
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
        titulo="Facturas"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "60px", enableSort: true },
          { key: "residente", label: "Residente" },
          { key: "descripcion", label: "Descripción" },
          { key: "fecha_emision", label: "Emisión" },
          { key: "fecha_limite", label: "Vencimiento" },
          { key: "estado", label: "Estado" },
          { key: "monto_total", label: "Total" },
          { key: "detalles", label: "Detalles" },
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteItem}
        title="Eliminar Factura"
        message={`¿Eliminar factura #${deleteItem?.id}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}