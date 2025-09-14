import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import { api } from "../../../services/apiClient.js";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";

export default function RolesPage() {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
   const [deleteUser, setDeleteUser] = useState(null);
  const navigate = useNavigate();

  function cargar() {
    setLoading(true);
    setError("");
    api.get("/api/cuenta/roles/")
      .then(data => setRoles(Array.isArray(data) ? data : []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { cargar(); }, []);

  function confirmDelete() {
    if (!deleteUser) return;
    setLoading(true);
    api.del(`/api/cuenta/usuarios/${deleteUser.id}/`)
      .then(() => {
        setDeleteUser(null);
        cargar();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  function eliminar(row) {
    if (!confirm(`Eliminar rol "${row.nombre}"?`)) return;
    setLoading(true);
    api.del(`/api/cuenta/roles/${row.id}/`)
      .then(() => cargar())
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="px-4 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}
      <SmartTable
        titulo="Roles"
        data={roles}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "70px", enableSort: true },
          { key: "nombre", label: "Nombre", enableSort: true }
        ]}
        onCreate={() => navigate("/dashboard/usuarios/roles/nuevo")}
        onEdit={(row) => navigate(`/dashboard/usuarios/roles/${row.id}/editar`)}
        onDelete={eliminar}
      />

         <ConfirmDialog
        open={!!deleteUser}
        title="Eliminar Usuario"
        message={`¿Seguro que deseas eliminar "${deleteUser?.correo}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteUser(null)}
      />

    </div>
  );
}
