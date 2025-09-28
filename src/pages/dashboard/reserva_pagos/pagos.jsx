import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import { api } from "../../../services/apiClient.js";

export default function PagosPage() {
  const [loading, setLoading] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    api
      .get("/api/pagos/")
      .then((a) => setPagos(Array.isArray(a) ? a : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    cargar();
  }, []);

  const rows = pagos.map((a) => ({
    id: a.id,
    factura: a.factura,
    monto: a.monto,
    estado: a.estado,
    fecha_pago: a.fecha_pago,
    notas: a.notas,
  }));

  return (
    <div className="space-y-8">
      {error && (
        <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      <SmartTable
        titulo="Pagos (Bitácora)"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "60px", enableSort: true },
          { key: "factura", label: "Factura" },
          { key: "monto", label: "Monto" },
          { key: "estado", label: "Estado" },
          { key: "fecha_pago", label: "Fecha" },
          { key: "notas", label: "Notas", width: "200px" },
        ]}
        // Sin acciones
      />
    </div>
  );
}