import { useEffect, useState } from "react";

export default function AreaForm({ initialData=null, reglas=[], onSubmit, onCancel, loading=false }) {
  const editMode = !!initialData;
  const [form,setForm]=useState({
    nombre:"",
    descripcion:"",
    activo:true,
    reglasSeleccionadas:[],
    requiere_reserva:false,
    capacidad_maxima:"",
    costo_reserva:"",
    tiempo_reserva_minima:"",
    tiempo_reserva_maxima:"",
    estado:"disponible"
  });
  const [touched,setTouched]=useState({});

  useEffect(()=>{
    if(initialData){
      setForm({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        activo: initialData.activo,
        reglasSeleccionadas: (initialData.reglas || []).map(r=>r.id),
        requiere_reserva: initialData.requiere_reserva ?? false,
        capacidad_maxima: initialData.capacidad_maxima ?? "",
        costo_reserva: initialData.costo_reserva ?? "",
        tiempo_reserva_minima: initialData.tiempo_reserva_minima ?? "",
        tiempo_reserva_maxima: initialData.tiempo_reserva_maxima ?? "",
        estado: initialData.estado || "disponible"
      });
    } else {
      setForm({
        nombre:"",
        descripcion:"",
        activo:true,
        reglasSeleccionadas:[],
        requiere_reserva:false,
        capacidad_maxima:"",
        costo_reserva:"",
        tiempo_reserva_minima:"",
        tiempo_reserva_maxima:"",
        estado:"disponible"
      });
    }
  },[initialData]);

  function toggleRegla(id){
    setForm(f=>{
      const exists = f.reglasSeleccionadas.includes(id);
      return {
        ...f,
        reglasSeleccionadas: exists
          ? f.reglasSeleccionadas.filter(x=>x!==id)
          : [...f.reglasSeleccionadas, id]
      };
    });
  }

  function submit(e){
    e.preventDefault();
    setTouched({nombre:true});
    if(!form.nombre) return;
    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      activo: form.activo,
      requiere_reserva: form.requiere_reserva,
      capacidad_maxima: form.capacidad_maxima ? parseInt(form.capacidad_maxima) : null,
      costo_reserva: form.costo_reserva ? parseFloat(form.costo_reserva) : null,
      tiempo_reserva_minima: form.tiempo_reserva_minima ? parseInt(form.tiempo_reserva_minima) : null,
      tiempo_reserva_maxima: form.tiempo_reserva_maxima ? parseInt(form.tiempo_reserva_maxima) : null,
      estado: form.estado
    };
    if(editMode) payload.id = initialData.id;
    onSubmit(payload, form.reglasSeleccionadas);
  }

  const invalid = { nombre: touched.nombre && !form.nombre };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={submit}
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">{editMode?"Editar Área":"Nueva Área"}</h2>
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
              onChange={e=>setForm(f=>({...f,nombre:e.target.value}))}
              onBlur={()=>setTouched(t=>({...t,nombre:true}))} disabled={loading}/>
          </Field>
          <Field label="Activo">
            <div className="flex items-center gap-2 h-[46px] px-4 rounded-2xl border border-gray-300 bg-white">
              <input type="checkbox" checked={form.activo} onChange={e=>setForm(f=>({...f,activo:e.target.checked}))} disabled={loading} className="w-4 h-4 accent-blue-600"/>
              <span className="text-sm">{form.activo? "Sí":"No"}</span>
            </div>
          </Field>
          <Field label="Descripción">
            <textarea
              className="input-base h-32 resize-y"
              value={form.descripcion}
              onChange={e=>setForm(f=>({...f,descripcion:e.target.value}))} disabled={loading}/>
          </Field>
          <Field label="Reglas (opcional)">
            <div className="max-h-40 overflow-auto border rounded-2xl p-2 flex flex-col gap-1">
              {reglas.length === 0 && <span className="text-xs text-gray-400 px-1">No hay reglas</span>}
              {reglas.map(r=>(
                <label key={r.id} className="flex items-center gap-2 text-xs px-2 py-1 rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    disabled={loading}
                    checked={form.reglasSeleccionadas.includes(r.id)}
                    onChange={()=>toggleRegla(r.id)}
                    className="accent-blue-600"
                  />
                  <span>{r.nombre}</span>
                </label>
              ))}
            </div>
          </Field>
          <Field label="Requiere reserva">
            <div className="flex items-center gap-2 h-[46px] px-4 rounded-2xl border border-gray-300 bg-white">
              <input type="checkbox" checked={form.requiere_reserva} onChange={e=>setForm(f=>({...f,requiere_reserva:e.target.checked}))} disabled={loading} className="w-4 h-4 accent-blue-600"/>
              <span className="text-sm">{form.requiere_reserva? "Sí":"No"}</span>
            </div>
          </Field>
          <Field label="Capacidad máxima">
            <input
              className="input-base"
              type="number"
              min="1"
              value={form.capacidad_maxima}
              onChange={e=>setForm(f=>({...f,capacidad_maxima:e.target.value}))}
              disabled={loading}
              placeholder="Ej: 50"
            />
          </Field>
          <Field label="Costo reserva">
            <input
              className="input-base"
              type="number"
              min="0"
              step="0.01"
              value={form.costo_reserva}
              onChange={e=>setForm(f=>({...f,costo_reserva:e.target.value}))}
              disabled={loading}
              placeholder="Ej: 100.00"
            />
          </Field>
          <Field label="Tiempo reserva mínima (Hr)">
            <input
              className="input-base"
              type="number"
              min="0"
              value={form.tiempo_reserva_minima}
              onChange={e=>setForm(f=>({...f,tiempo_reserva_minima:e.target.value}))}
              disabled={loading}
              placeholder="Ej: 30"
            />
          </Field>
          <Field label="Tiempo reserva máxima (Hr)">
            <input
              className="input-base"
              type="number"
              min="0"
              value={form.tiempo_reserva_maxima}
              onChange={e=>setForm(f=>({...f,tiempo_reserva_maxima:e.target.value}))}
              disabled={loading}
              placeholder="Ej: 120"
            />
          </Field>
          <Field label="Estado">
            <select
              className="input-base"
              value={form.estado}
              onChange={e=>setForm(f=>({...f,estado:e.target.value}))}
              disabled={loading}
            >
              <option value="disponible">Disponible</option>
              <option value="mantenimiento">En Mantenimiento</option>
              <option value="cerrado">Cerrado</option>
            </select>
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