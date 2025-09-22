import React from "react";

export default function TablaHorarios({ horarios = [], area = null }) {
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  // Generar franjas horarias de 45 minutos
  const generarFranjasHorarias = () => {
    const franjas = [];
    for (let hora = 7; hora < 23; hora++) {
      for (let minutos = 0; minutos < 60; minutos += 60) {
        const horaInicio = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
        const siguienteMinuto = minutos + 60;
        const siguienteHora = siguienteMinuto >= 60 ? hora + 1 : hora;
        const minutosFinales = siguienteMinuto >= 60 ? siguienteMinuto - 60 : siguienteMinuto;
        const horaFin = `${siguienteHora.toString().padStart(2, '0')}:${minutosFinales.toString().padStart(2, '0')}`;
        
        franjas.push({
          inicio: horaInicio,
          fin: horaFin,
          label: `${horaInicio} - ${horaFin}`
        });
      }
    }
    return franjas;
  };

  const franjas = generarFranjasHorarias();

  // Función para verificar si un horario está disponible en una franja específica
  const estaDisponible = (dia, franja) => {
    const horarioDelDia = horarios.find(h => h.dia_semana === dia && h.activo);
    if (!horarioDelDia) return false;

    // Convertir strings de tiempo a formato comparable
    const apertura = horarioDelDia.hora_apertura;
    const cierre = horarioDelDia.hora_cierre;
    
    // Comparar directamente las horas en formato HH:MM
    return franja.inicio >= apertura && franja.fin <= cierre;
  };

  // Colores para diferentes estados
  const obtenerColorCelda = (dia, franja) => {
    const disponible = estaDisponible(dia, franja);
    if (!disponible) return 'bg-gray-100 text-gray-400'; // No disponible
    
    // Diferentes colores según el área
    const colores = [
      'bg-green-200 text-green-800',
      'bg-blue-200 text-blue-800', 
      'bg-purple-200 text-purple-800',
      'bg-yellow-200 text-yellow-800',
      'bg-pink-200 text-pink-800',
      'bg-indigo-200 text-indigo-800'
    ];
    
    // Usar el ID del área para asignar color consistente
    const colorIndex = area ? (area.id % colores.length) : 0;
    return colores[colorIndex];
  };

  // Función para obtener texto corto del área
  const obtenerTextoArea = () => {
    if (!area) return 'DISPONIBLE';
    // Tomar las primeras letras o crear un código corto
    const palabras = area.nombre.toUpperCase().split(' ');
    if (palabras.length > 1) {
      return palabras.map(p => p.charAt(0)).join('') + (area.id ? ` - ${area.id}` : '');
    }
    return area.nombre.substring(0, 8).toUpperCase();
  };

  return (
    <div className="w-full overflow-auto bg-white rounded-xl shadow border">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">
          Horarios de disponibilidad
          {area && <span className="text-blue-600"> - {area.nombre}</span>}
        </h3>
        {horarios.length === 0 && (
          <p className="text-sm text-gray-500 mt-1">
            No hay horarios configurados para esta área
          </p>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-green-100">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r min-w-[120px]">
                HORARIO
              </th>
              {dias.map(dia => (
                <th key={dia} className="px-3 py-3 text-center text-sm font-semibold text-gray-700 border-r min-w-[100px]">
                  {dia.substring(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {franjas.map((franja, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-xs font-mono text-gray-600 border-r bg-gray-50">
                  {franja.label}
                </td>
                {dias.map(dia => {
                  const disponible = estaDisponible(dia, franja);
                  const colorClass = obtenerColorCelda(dia, franja);
                  return (
                    <td 
                      key={`${dia}-${index}`} 
                      className={`px-2 py-2 text-center border-r ${colorClass}`}
                    >
                      {disponible && (
                        <div className="text-xs font-bold py-1 rounded">
                          {obtenerTextoArea()}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Leyenda */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 border"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border"></div>
            <span>No disponible</span>
          </div>
          {area && (
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 border ${obtenerColorCelda('Lunes', franjas[0]).split(' ')[0]}`}></div>
              <span>{area.nombre}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}