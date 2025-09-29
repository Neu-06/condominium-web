import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";
import { api } from "../../../services/apiClient.js";
import FacturaForm from "../../../components/dashboard/FacturaForm.jsx";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // 🔹 CAMBIO AQUÍ

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
          setEditing(response);
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

  // 🔹 FUNCIÓN CORREGIDA PARA GENERAR REPORTE PDF
  function generarReportePDF() {
    const hoy = new Date();
    const facturasVencidas = facturas.filter(factura => {
      const fechaLimite = new Date(factura.fecha_limite);
      return fechaLimite < hoy && factura.estado !== 'pagada';
    });

    if (facturasVencidas.length === 0) {
      alert('No hay facturas vencidas para reportar.');
      return;
    }

    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('Reporte de Facturas Vencidas', 14, 20);
    
    // Fecha del reporte
    doc.setFontSize(12);
    doc.text(`Fecha del reporte: ${hoy.toLocaleDateString('es-ES')}`, 14, 30);
    doc.text(`Total de facturas vencidas: ${facturasVencidas.length}`, 14, 38);

    // Tabla con las facturas vencidas usando autoTable
    autoTable(doc, { // 🔹
      head: [['ID', 'Residente', 'Descripción', 'Vencimiento', 'Monto', 'Estado']],
      body: facturasVencidas.map(factura => [
        factura.id,
        factura.residente?.nombre || 'Sin residente',
        factura.descripcion,
        factura.fecha_limite,
        `$${factura.monto_total}`,
        factura.estado
      ]),
      startY: 45,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [99, 102, 241] },
    });

    // Guardar el PDF
    doc.save(`facturas-vencidas-${hoy.toISOString().split('T')[0]}.pdf`);
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

      <div className="flex justify-end">
        <button
          onClick={generarReportePDF}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          disabled={loading}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Reporte Morosidad
        </button>
      </div>

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