import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";
import { api } from "../../../services/apiClient.js";
import AreaForm from "../../../components/dashboard/AreaForm.jsx";

export default function AreasPage() {
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState([]);
  const [reglas, setReglas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    Promise.all([api.get("/api/areas-comunes/"), api.get("/api/reglas/")])
      .then(([a, r]) => {
        setAreas(Array.isArray(a) ? a : []);
        setReglas(Array.isArray(r) ? r : []);
      })
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
    const area = areas.find((a) => a.id === row.id);
    if (!area) return;
    setEditing(area);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function save(areaData, selectedReglas) {
    setLoading(true);
    const isEdit = !!areaData.id;
    const url = isEdit
      ? `/api/areas-comunes/${areaData.id}/`
      : "/api/areas-comunes/";
    const method = isEdit ? api.put : api.post;
    method(url, areaData)
      .then((res) => {
        const areaId = isEdit ? areaData.id : res.id;
        if (selectedReglas && selectedReglas.length >= 0) {
          return api.post(`/api/areas-comunes/${areaId}/asignar-reglas/`, {
            reglas: selectedReglas,
          });
        }
      })
      .then(() => {
        setShowForm(false);
        setEditing(null);
        cargar();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  function onDelete(row) {
    const area = areas.find((a) => a.id === row.id);
    if (!area) return;
    setDeleteItem(area);
  }
  function confirmDelete() {
    if (!deleteItem) return;
    setLoading(true);
    api
      .del(`/api/areas-comunes/${deleteItem.id}/`)
      .then(() => {
        setDeleteItem(null);
        cargar();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  const rows = areas.map((a) => ({
    id: a.id,
    nombre: a.nombre,
    descripcion: a.descripcion,
    activo: a.activo,
    conReserva: a.requiere_reserva,
    capacidadMaxima: a.capacidad_maxima,
    costoReserva: a.costo_reserva,
    tiempoReservaMinima: a.tiempo_reserva_minima,
    tiempoReservaMaxima: a.tiempo_reserva_maxima,
    estado: a.estado,
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <AreaForm
          initialData={editing}
          reglas={reglas}
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
        titulo="Áreas Comunes"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "60px", enableSort: true },
          { key: "nombre", label: "Nombre", enableSort: true },
          {
            key: "conReserva",
            label: "Reserva",
            render: (r) => (
              <span className="text-xs">{r.conReserva ? "Sí" : "No"}</span>
            ),
            width: "90px",
          },
          {
            key: "capacidadMaxima",
            label: "Capacidad",
            render: (r) => (
              <span className="text-xs">{r.capacidadMaxima || "-"}</span>
            ),
            width: "90px",
          },
          {
            key: "costoReserva",
            label: "Costo Reserva",
            render: (r) => {
              const valor = Number(r.costoReserva);
              return (
                <span className="text-xs">
                  {isNaN(valor) ? "-" : `$${valor.toFixed(2)}`}
                </span>
              );
            },
            width: "110px",
          },
          {
            key: "tiempoReservaMinima",
            label: "Tiempo Mínimo",
            render: (r) => (
              <span className="text-xs">
                {r.tiempoReservaMinima != null
                  ? `${r.tiempoReservaMinima} Hr`
                  : "-"}
              </span>
            ),
            width: "110px",
          },
          {
            key: "tiempoReservaMaxima",
            label: "Tiempo Máximo",
            render: (r) => (
              <span className="text-xs">
                {r.tiempoReservaMaxima != null
                  ? `${r.tiempoReservaMaxima} Hr`
                  : "-"}
              </span>
            ),
            width: "110px",
          },
          { key: "estado", label: "Estado", enableSort: true },
          {
            key: "activo",
            label: "Activo",
            render: (r) => (
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  r.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {r.activo ? "si" : "no"}
              </span>
            ),
            width: "100px",
          },
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteItem}
        title="Eliminar Área"
        message={`¿Eliminar área "${deleteItem?.nombre}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}
