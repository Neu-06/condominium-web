import { useEffect, useState } from "react";

export default function PersonalForm({ initialData=null, onSubmit, onCancel, loading=false }) {
  const editMode = !!initialData;
  const [form, setForm] = useState({
    nombre: "", apellido: "", dni: "", fecha_nacimiento: "",
    telefono: "", correo: "", direccion: "", fecha_contratacion: "",
    puesto: "", activo: true, fecha_salida: "", estado: "ACTIVO"
  });
  const [touched, setTouched] = useState({});

  useEffect(()=>{
    if(initialData){
      setForm({
        nombre: initialData.nombre || "",
        apellido: initialData.apellido || "",
        dni: initialData.dni || "",
        fecha_nacimiento: initialData.fecha_nacimiento || "",
        telefono: initialData.telefono || "",
        correo: initialData.correo || "",
        direccion: initialData.direccion || "",
        fecha_contratacion: initialData.fecha_contratacion || "",
        puesto: initialData.puesto || "",
        activo: initialData.activo,
        fecha_salida: initialData.fecha_salida || "",
        estado: initialData.estado || "ACTIVO"
      });
    } else {
      setForm({
        nombre: "", apellido: "", dni: "", fecha_nacimiento: "",
        telefono: "", correo: "", direccion: "", fecha_contratacion: "",
        puesto: "", activo: true, fecha_salida: "", estado: "ACTIVO"
      });
    }
  },[initialData]);

  function setField(k,v){ setForm(f=>({...f,[k]:v})); }
  function submit(e){
    e.preventDefault();
    setTouched({nombre:true, apellido:true, dni:true});
    if(!form.nombre || !form.apellido || !form.dni) return;
    const payload = {...form};
    if(editMode) payload.id = initialData.id;
    if(!payload.fecha_salida) payload.fecha_salida = null;
    onSubmit(payload);
  }
  const invalid = {
    nombre: touched.nombre && !form.nombre,
    apellido: touched.apellido && !form.apellido,
    dni: touched.dni && !form.dni
  };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={submit}
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        {/* cabecera */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">{editMode? "Editar Personal":"Nuevo Personal"}</h2>
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
              onChange={e=>setField('nombre',e.target.value)} onBlur={()=>setTouched(t=>({...t,nombre:true}))} disabled={loading} />
          </Field>
          <Field label="Apellido *" error={invalid.apellido && "Requerido"}>
            <input className={`input-base ${invalid.apellido?"input-error":""}`} value={form.apellido}
              onChange={e=>setField('apellido',e.target.value)} onBlur={()=>setTouched(t=>({...t,apellido:true}))} disabled={loading} />
          </Field>
          <Field label="DNI *" error={invalid.dni && "Requerido"}>
            <input className={`input-base ${invalid.dni?"input-error":""}`} value={form.dni}
              onChange={e=>setField('dni',e.target.value)} onBlur={()=>setTouched(t=>({...t,dni:true}))} disabled={loading} />
          </Field>
          <Field label="Fecha Nacimiento">
            <input type="date" className="input-base" value={form.fecha_nacimiento} onChange={e=>setField('fecha_nacimiento',e.target.value)} disabled={loading}/>
          </Field>
            <Field label="Teléfono">
            <input className="input-base" value={form.telefono} onChange={e=>setField('telefono',e.target.value)} disabled={loading}/>
          </Field>
          <Field label="Correo">
            <input type="email" className="input-base" value={form.correo} onChange={e=>setField('correo',e.target.value)} disabled={loading}/>
          </Field>
          <Field label="Dirección">
            <input className="input-base" value={form.direccion} onChange={e=>setField('direccion',e.target.value)} disabled={loading}/>
          </Field>
          <Field label="Fecha Contratación">
            <input type="date" className="input-base" value={form.fecha_contratacion} onChange={e=>setField('fecha_contratacion',e.target.value)} disabled={loading}/>
          </Field>
          <Field label="Puesto">
            <select className="input-base" value={form.puesto} onChange={e=>setField('puesto',e.target.value)} disabled={loading}>
              <option value="ADMINISTRADOR">ADMINISTRADOR</option>
              <option value="SUPERVISOR">SUPERVISOR</option>
              <option value="MANTENIMIENTO">MANTENIMIENTO</option>
              <option value="SEGURIDAD">SEGURIDAD</option>
              <option value="LIMPIEZA">LIMPIEZA</option>
              <option value="OTRO">OTRO</option>
            </select>
          </Field>
          <Field label="Fecha Salida">
            <input type="date" className="input-base" value={form.fecha_salida || ""} onChange={e=>setField('fecha_salida',e.target.value)} disabled={loading}/>
          </Field>
          <Field label="Activo">
            <div className="flex items-center gap-2 h-[46px] px-4 rounded-2xl border border-gray-300 bg-white">
              <input type="checkbox" checked={form.activo} onChange={e=>setField('activo',e.target.checked)} disabled={loading} className="w-4 h-4 accent-blue-600"/>
              <span className="text-sm">{form.activo? "Sí":"No"}</span>
            </div>
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