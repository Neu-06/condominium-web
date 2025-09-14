import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";
import { api } from "../../../services/apiClient.js";
import PersonalForm from "../../../components/dashboard/PersonalForm.jsx";

export default function PersonalPage(){
  const [loading,setLoading]=useState(false);
  const [list,setList]=useState([]);
  const [showForm,setShowForm]=useState(false);
  const [editing,setEditing]=useState(null);
  const [deleteItem,setDeleteItem]=useState(null);
  const [error,setError]=useState("");

  function cargar(){
    setLoading(true); setError("");
    api.get('/api/personal/')
      .then(d=> setList(Array.isArray(d)?d:[]))
      .catch(e=>setError(e.message))
      .finally(()=> setLoading(false));
  }
  useEffect(()=>{ cargar(); },[]);

  function onCreate(){
    setEditing(null);
    setShowForm(true);
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function onEdit(row){
    const item = list.find(p=>p.id===row.id);
    if(!item) return;
    setEditing(item);
    setShowForm(true);
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function save(data){
    setLoading(true);
    const isEdit = !!data.id;
    const url = isEdit? `/api/personal/${data.id}/` : '/api/personal/';
    const method = isEdit? api.put : api.post;
    method(url, data)
      .then(()=> { setShowForm(false); setEditing(null); cargar(); })
      .catch(e=>setError(e.message))
      .finally(()=> setLoading(false));
  }
  function onDelete(row){
    const item = list.find(p=>p.id===row.id);
    if(!item) return;
    setDeleteItem(item);
  }
  function confirmDelete(){
    if(!deleteItem) return;
    setLoading(true);
    api.del(`/api/personal/${deleteItem.id}/`)
      .then(()=> { setDeleteItem(null); cargar(); })
      .catch(e=>setError(e.message))
      .finally(()=> setLoading(false));
  }

  const rows = list.map(p=>({
    id:p.id,
    nombre:p.nombre,
    apellido:p.apellido,
    dni:p.dni,
    puesto:p.puesto,
    estado:p.estado,
    activo:p.activo
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <PersonalForm
          initialData={editing}
          onSubmit={save}
          onCancel={()=>{ setShowForm(false); setEditing(null); }}
          loading={loading}
        />
      )}

      {error && <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded">{error}</div>}

      <SmartTable
        titulo="Personal"
        data={rows}
        loading={loading}
        columns={[
          { key:'id', label:'ID', width:'60px', enableSort:true },
          { key:'nombre', label:'Nombre', enableSort:true },
            { key:'apellido', label:'Apellido', enableSort:true },
          { key:'dni', label:'DNI', enableSort:true },
          { key:'puesto', label:'Puesto' },
          { key:'estado', label:'Estado',
            render:r=> <span className={`px-2 py-0.5 rounded text-xs ${r.estado==='ACTIVO'?'bg-green-100 text-green-700':'bg-gray-200 text-gray-700'}`}>{r.estado}</span>
          },
          { key:'activo', label:'Activo',
            render:r=> <span className={`px-2 py-0.5 rounded text-xs ${r.activo?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>{r.activo?'Sí':'No'}</span>,
            width:'80px'
          }
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteItem}
        title="Eliminar Personal"
        message={`¿Eliminar a ${deleteItem?.nombre} ${deleteItem?.apellido}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={()=>setDeleteItem(null)}
      />
    </div>
  );
}