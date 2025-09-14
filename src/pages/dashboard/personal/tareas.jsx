import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";
import { api } from "../../../services/apiClient.js";
import TareaForm from "../../../components/dashboard/TareaForm.jsx";

export default function TareasPage(){
  const [loading,setLoading]=useState(false);
  const [tareas,setTareas]=useState([]);
  const [personal,setPersonal]=useState([]);
  const [showForm,setShowForm]=useState(false);
  const [editing,setEditing]=useState(null);
  const [deleteItem,setDeleteItem]=useState(null);
  const [error,setError]=useState("");

  function cargar(){
    setLoading(true); setError("");
    Promise.all([
      api.get('/api/tareas/'),
      api.get('/api/personal/')
    ])
    .then(([t,p])=>{
      setTareas(Array.isArray(t)?t:[]);
      setPersonal(Array.isArray(p)?p:[]);
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
    const item = tareas.find(t=>t.id===row.id);
    if(!item) return;
    setEditing(item);
    setShowForm(true);
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function save(data){
    setLoading(true);
    const isEdit = !!data.id;
    const url = isEdit? `/api/tareas/${data.id}/` : '/api/tareas/';
    const method = isEdit? api.put : api.post;
    method(url, data)
      .then(()=> { setShowForm(false); setEditing(null); cargar(); })
      .catch(e=>setError(e.message))
      .finally(()=> setLoading(false));
  }
  function onDelete(row){
    const item = tareas.find(t=>t.id===row.id);
    if(!item) return;
    setDeleteItem(item);
  }
  function confirmDelete(){
    if(!deleteItem) return;
    setLoading(true);
    api.del(`/api/tareas/${deleteItem.id}/`)
      .then(()=> { setDeleteItem(null); cargar(); })
      .catch(e=>setError(e.message))
      .finally(()=>setLoading(false));
  }

  const rows = tareas.map(t=>({
    id:t.id,
    nombre:t.nombre,
    personal:`${t.personal_nombre || ""} ${t.personal_apellido || ""}`.trim(),
    estado:t.estado,
    fecha_asignacion:t.fecha_asignacion,
    fecha_vencimiento:t.fecha_vencimiento
  }));

  function fmt(d){
    if(!d) return "—";
    const date = new Date(d);
    return isNaN(date.getTime())? d : date.toLocaleDateString();
  }

  return (
    <div className="space-y-8">
      {showForm && (
        <TareaForm
          initialData={editing}
          personal={personal}
          onSubmit={save}
          onCancel={()=>{ setShowForm(false); setEditing(null); }}
          loading={loading}
        />
      )}

      {error && <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded">{error}</div>}

      <SmartTable
        titulo="Tareas"
        data={rows}
        loading={loading}
        columns={[
          { key:'id', label:'ID', width:'60px', enableSort:true },
          { key:'nombre', label:'Nombre', enableSort:true },
          { key:'personal', label:'Personal', enableSort:true },
          { key:'estado', label:'Estado',
            render:r=> <span className={`px-2 py-0.5 rounded text-xs ${
              r.estado==='COMPLETADO'?'bg-green-100 text-green-700':
              r.estado==='PROGRESO'?'bg-yellow-100 text-yellow-700':
              'bg-gray-200 text-gray-700'
            }`}>{r.estado}</span>
          },
          { key:'fecha_asignacion', label:'Asignada', render:(r,v)=> <span className="text-xs">{fmt(v)}</span> },
          { key:'fecha_vencimiento', label:'Vence', render:(r,v)=> <span className="text-xs">{fmt(v)}</span> }
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteItem}
        title="Eliminar Tarea"
        message={`¿Eliminar "${deleteItem?.nombre}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={()=>setDeleteItem(null)}
      />
    </div>
  );
}