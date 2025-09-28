import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import { api } from "../../../services/apiClient.js";

export default function BitacoraPage() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    api
      .get("/api/cuenta/bitacora/")
      .then((d) => setList(Array.isArray(d) ? d : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    cargar();
  }, []);

  const rows = list.map((p) => ({
    id: p.id,
    accion: p.accion,
    descripcion: p.descripcion,
    ip: p.ip,
    usuario: p.usuario_correo, 
    fecha: p.fecha,
  }));

  return (
    <div className="space-y-8">
      {error && (
        <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      <SmartTable
        titulo="Bitacora"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "60px", enableSort: true },
          { key: "accion", label: "Acción", enableSort: true },
          { key: "descripcion", label: "Descripción", enableSort: true },
          { key: "ip", label: "IP", enableSort: true },
          { key: "usuario", label: "Usuario", enableSort: true },
          { key: "fecha", label: "Fecha", enableSort: true },
        ]}
        onCreate={null}
        onEdit={null}
        onDelete={null}
      />
    </div>
  );
}
