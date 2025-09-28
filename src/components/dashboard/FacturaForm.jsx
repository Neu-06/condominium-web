import { useEffect, useState } from "react";
import { api } from "../../services/apiClient.js";

const initialFormState = {
  id: null,
  residente_id: "",
  descripcion: "",
  fecha_limite: "",
  monto_total: 0,
  estado: "pendiente",
};

export default function FacturaForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const editMode = !!initialData;
  const [form, setForm] = useState(initialFormState);
  const [residentes, setResidentes] = useState([]);
  const [conceptos, setConceptos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [detalle, setDetalle] = useState({
    concepto_id: "",
    reserva_id: "",
  });

  useEffect(() => {
    api.get("/api/residentes/").then(setResidentes);
    api.get("/api/conceptos-pago/").then(setConceptos);
    api.get("/api/reservas/").then(setReservas);
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialFormState,
        ...initialData,
        residente_id:
          initialData.residente?.id || initialData.residente_id || "",
      });
      if (initialData.id) {
        cargarDetalles(initialData.id);
      }
    } else {
      setForm(initialFormState);
      setDetalles([]);
    }
  }, [initialData]);

  function cargarDetalles(facturaId) {
    api
      .get(`/api/detalles-factura/?factura=${facturaId}`)
      .then(setDetalles)
      .catch(console.error);
  }

  function submit(e) {
    e.preventDefault();
    if (!form.residente_id) return;

    const payload = {
      ...form,
      residente_id: parseInt(form.residente_id, 10),
      monto_total: 0,
    };

    onSubmit(payload);
  }

  function agregarDetalle() {
    if (!detalle.concepto_id || !form.id) return;

    const payload = {
      factura: parseInt(form.id, 10),
      concepto: parseInt(detalle.concepto_id, 10),
      reserva: detalle.reserva_id ? parseInt(detalle.reserva_id, 10) : null,
    };

    api
      .post("/api/detalles-factura/", payload)
      .then(() => {
        cargarDetalles(form.id);
        setTimeout(() => recargarFactura(), 200);
        setDetalle({ concepto_id: "", reserva_id: "" });
      })
      .catch(console.error);
  }

  function eliminarDetalle(detalleId) {
    api
      .del(`/api/detalles-factura/${detalleId}/`)
      .then(() => {
        cargarDetalles(form.id);
        setTimeout(() => recargarFactura(), 200);
      })
      .catch(console.error);
  }

  function recargarFactura() {
    if (form.id) {
      api
        .get(`/api/facturas/${form.id}/`)
        .then((factura) => {
          setForm((f) => ({ ...f, monto_total: factura.monto_total }));
        })
        .catch(console.error);
    }
  }

  return (
    <div className="w-full flex justify-center px-3">
      <form
        onSubmit={submit}
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8"
      >
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Editar Factura" : "Nueva Factura"}
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-5 py-2 rounded-xl border text-sm bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              disabled={loading}
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
            >
              {loading
                ? "Guardando..."
                : editMode
                ? "Guardar Cambios"
                : "Crear"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Residente *">
            <select
              className="input-base"
              value={form.residente_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, residente_id: e.target.value }))
              }
              disabled={loading}
            >
              <option value="">Selecciona un residente</option>
              {residentes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Estado">
            <select
              className="input-base"
              value={form.estado}
              onChange={(e) =>
                setForm((f) => ({ ...f, estado: e.target.value }))
              }
              disabled={loading}
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagada">Pagada</option>
              <option value="vencida">Vencida</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </Field>

          <Field label="Descripción">
            <textarea
              className="input-base"
              value={form.descripcion}
              onChange={(e) =>
                setForm((f) => ({ ...f, descripcion: e.target.value }))
              }
              disabled={loading}
              placeholder="Descripción de la factura"
            />
          </Field>

          <Field label="Fecha límite">
            <input
              type="date"
              className="input-base"
              value={form.fecha_limite}
              onChange={(e) =>
                setForm((f) => ({ ...f, fecha_limite: e.target.value }))
              }
              disabled={loading}
            />
          </Field>
        </div>

        {form.id && (
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Detalles de Factura</h3>

            <div className="flex gap-2 mb-4">
              <select
                className="input-base flex-1"
                value={detalle.concepto_id}
                onChange={(e) =>
                  setDetalle((d) => ({ ...d, concepto_id: e.target.value }))
                }
              >
                <option value="">Seleccionar concepto</option>
                {conceptos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} - ${c.monto}
                  </option>
                ))}
              </select>

              <select
                className="input-base flex-1"
                value={detalle.reserva_id}
                onChange={(e) =>
                  setDetalle((d) => ({ ...d, reserva_id: e.target.value }))
                }
              >
                <option value="">Reserva (opcional)</option>
                {reservas.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.area?.nombre} - {r.fecha_reserva}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={agregarDetalle}
                disabled={!detalle.concepto_id}
              >
                Agregar
              </button>
            </div>

            {detalles.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {detalles.map((d) => (
                    <li
                      key={d.id}
                      className="flex justify-between items-center bg-white p-3 rounded border"
                    >
                      <span>
                        {d.concepto_nombre} - ${d.monto}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => eliminarDetalle(d.id)}
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 font-bold text-lg text-green-600">
                  Total: ${form.monto_total}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4 bg-gray-50 rounded">
                No hay detalles agregados
              </div>
            )}
          </div>
        )}

        {!form.id && (
          <div className="text-gray-500 text-center py-4">
            Primero crea la factura, luego podrás agregar detalles.
          </div>
        )}
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      {children}
    </div>
  );
}
