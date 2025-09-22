import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";
import { api } from "../../../services/apiClient.js";
import ReglaForm from "../../../components/dashboard/ReglaForm.jsx";

export default function ReglasPage(){
  const [loading,setLoading]=useState(false);
  const [reglas,setReglas]=useState([]);
  const [areas,setAreas]=useState([]);
  const [showForm,setShowForm]=useState(false);
  const [editing,setEditing]=useState(null);
  const [deleteItem,setDeleteItem]=useState(null);
  const [error,setError]=useState("");

  function cargar(){
    setLoading(true); setError("");
    Promise.all([
      api.get('/api/reglas/'),
      api.get('/api/areas-comunes/')
    ])
      .then(([r,a])=>{
        setReglas(Array.isArray(r)?r:[]);
        setAreas(Array.isArray(a)?a:[]);
      })
      .catch(e=>setError(e.message))
      .finally(()=>setLoading(false));
  }
  useEffect(()=>{ cargar(); },[]);

  function onCreate(){
    setEditing(null);
    setShowForm(true);
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function onEdit(row){
    const regla = reglas.find(r=>r.id===row.id);
    if(!regla) return;
    setEditing(regla);
    setShowForm(true);
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function save(data){
    setLoading(true);
    const isEdit = !!data.id;
    const url = isEdit? `/api/reglas/${data.id}/` : '/api/reglas/';
    const method = isEdit? api.put : api.post;
    method(url, data)
      .then(()=> { setShowForm(false); setEditing(null); cargar(); })
      .catch(e=>setError(e.message))
      .finally(()=> setLoading(false));
  }
  function onDelete(row){
    const regla = reglas.find(r=>r.id===row.id);
    if(!regla) return;
    setDeleteItem(regla);
  }
  function confirmDelete(){
    if(!deleteItem) return;
    setLoading(true);
    api.del(`/api/reglas/${deleteItem.id}/`)
      .then(()=> { setDeleteItem(null); cargar(); })
      .catch(e=>setError(e.message))
      .finally(()=> setLoading(false));
  }

  const rows = reglas.map(r=>({
    id:r.id,
    nombre:r.nombre,
    activo:r.activo,
    descripcion:r.descripcion,
    asignadas:(r.areas_ids?.length) || 0
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <ReglaForm
          initialData={editing}
          areas={areas}
          onSubmit={save}
          onCancel={()=>{ setShowForm(false); setEditing(null); }}
          loading={loading}
        />
      )}

      {error && <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded">{error}</div>}

      <SmartTable
        titulo="Reglas"
        data={rows}
        loading={loading}
        columns={[
          { key:'id', label:'ID', width:'60px', enableSort:true },
          { key:'nombre', label:'Nombre', enableSort:true },
          { key:'descripcion', label:'Descripción', hideBelow:'md' },
          { key:'asignadas', label:'Áreas', width:'90px' },
          { key:'activo', label:'Estado',
            render:r=> <span className={`px-2 py-0.5 rounded text-xs ${r.activo?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>{r.activo?'Activa':'Inactiva'}</span>,
            width:'100px'
          }
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteItem}
        title="Eliminar Regla"
        message={`¿Eliminar regla "${deleteItem?.nombre}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={()=>setDeleteItem(null)}
      />
    </div>
  );
}