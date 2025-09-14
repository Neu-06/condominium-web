import { useEffect, useState } from "react";

export default function TareaForm({ initialData=null, personal=[], onSubmit, onCancel, loading=false }) {
  const editMode = !!initialData;
  const [form,setForm]=useState({
    nombre:"", descripcion:"", fecha_asignacion:"", fecha_vencimiento:"",
    personal_id:"", estado:"PENDIENTE"
  });
  const [touched,setTouched]=useState({});

  useEffect(()=>{
    if(initialData){
      setForm({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        fecha_asignacion: initialData.fecha_asignacion || "",
        fecha_vencimiento: initialData.fecha_vencimiento || "",
        personal_id: initialData.personal_id || initialData.personal || "",
        estado: initialData.estado || "PENDIENTE"
      });
    } else {
      setForm({
        nombre:"", descripcion:"", fecha_asignacion:"", fecha_vencimiento:"",
        personal_id:"", estado:"PENDIENTE"
      });
    }
  },[initialData]);

  function setField(k,v){ setForm(f=>({...f,[k]:v})); }
  function submit(e){
    e.preventDefault();
    setTouched({nombre:true, personal_id:true});
    if(!form.nombre || !form.personal_id) return;
    const payload = {...form};
    if(editMode) payload.id = initialData.id;
    onSubmit(payload);
  }
  const invalid = {
    nombre: touched.nombre && !form.nombre,
    personal_id: touched.personal_id && !form.personal_id
  };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={submit}
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">{editMode? "Editar Tarea":"Nueva Tarea"}</h2>
          <div className="flex gap-3">
            <button type="button" onClick={onCancel} disabled={loading} className="px-5 py-2 rounded-xl border text-sm bg-white hover:bg-gray-50">Cancelar</button>
            <button disabled={loading} className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">
              {loading? "Guardando...": editMode? "Guardar Cambios":"Crear"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Nombre *" error={invalid.nombre && "Requerido"}>
            <input className={`input-base ${invalid.nombre?"input-error":""}`} value={form.nombre}
              onChange={e=>setField('nombre',e.target.value)} onBlur={()=>setTouched(t=>({...t,nombre:true}))} disabled={loading}/>
          </Field>
          <Field label="Personal *" error={invalid.personal_id && "Requerido"}>
            <select className={`input-base ${invalid.personal_id?"input-error":""}`} value={form.personal_id}
              onChange={e=>setField('personal_id',e.target.value)} onBlur={()=>setTouched(t=>({...t,personal_id:true}))} disabled={loading}>
              <option value="">Selecciona</option>
              {personal.map(p=> <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
            </select>
          </Field>
          <Field label="Fecha Asignación">
            <input type="date" className="input-base" value={form.fecha_asignacion} onChange={e=>setField('fecha_asignacion',e.target.value)} disabled={loading}/>
          </Field>
          <Field label="Fecha Vencimiento">
            <input type="date" className="input-base" value={form.fecha_vencimiento} onChange={e=>setField('fecha_vencimiento',e.target.value)} disabled={loading}/>
          </Field>
          <Field label="Estado">
            <select className="input-base" value={form.estado} onChange={e=>setField('estado',e.target.value)} disabled={loading}>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="PROGRESO">PROGRESO</option>
              <option value="COMPLETADO">COMPLETADO</option>
            </select>
          </Field>
          <Field label="Descripción">
            <textarea className="input-base h-32 resize-y" value={form.descripcion} onChange={e=>setField('descripcion',e.target.value)} disabled={loading}/>
          </Field>
        </div>
      </form>
    </div>
  );
}

function Field({label,error,children}){
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      {children}
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}