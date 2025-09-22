import React, { useState, useMemo } from "react";

/**
 * columns: [
 *  {
 *    key: 'correo',
 *    label: 'Correo',
 *    width: '180px',            // opcional
 *    hideBelow: 'sm'|'md'|'lg', // opcional (oculta debajo del breakpoint)
 *    enableSort: true,          // opcional
 *    render: (row, value) => JSX,
 *    headerClass: '',
 *    cellClass: ''
 *  }
 * ]
 */
export default function SmartTable({
  titulo = "Gestionar",
  data = [],
  columns = [],
  loading = false,
  emptyMessage = "Sin registros",
  onCreate,
  onEdit,
  onDelete,
  actionsLabel = "Opciones",
  actionsRender,                
  showDeletedButton = false,
  deletedActive = false,
  onToggleDeleted,
  className = "",
  compact = false               
}) {
  const [sortState, setSortState] = useState({ key: null, dir: null }); // dir: 'asc'|'desc'|null

  const sortableColumns = useMemo(
    () => new Set(columns.filter(c => c.enableSort).map(c => c.key)),
    [columns]
  );

  const sortedData = useMemo(() => {
    if (!sortState.key || !sortState.dir) return data;
    const arr = [...data];
    arr.sort((a, b) => {
      const va = a[sortState.key];
      const vb = b[sortState.key];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") {
        return sortState.dir === "asc" ? va - vb : vb - va;
      }
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa < sb) return sortState.dir === "asc" ? -1 : 1;
      if (sa > sb) return sortState.dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [data, sortState]);

  function toggleSort(col) {
    if (!sortableColumns.has(col.key)) return;
    setSortState(prev => {
      if (prev.key !== col.key) return { key: col.key, dir: "asc" };
      if (prev.dir === "asc") return { key: col.key, dir: "desc" };
      return { key: null, dir: null };
    });
  }

  const hideClass = (bp) => {
    switch (bp) {
      case "sm": return "hidden sm:table-cell";
      case "md": return "hidden md:table-cell";
      case "lg": return "hidden lg:table-cell";
      default: return "";
    }
  };

  return (
    <div className={`w-full bg-white shadow-lg rounded-2xl border border-gray-200 flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between px-5 py-4 border-b rounded-t-2xl bg-gradient-to-r from-blue-50 to-white">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">{titulo}</h2>
        <div className="flex flex-wrap gap-2">
          {showDeletedButton && (
            <button
              onClick={onToggleDeleted}
              className={`px-4 py-2 text-xs md:text-sm rounded-lg border font-semibold transition shadow-sm ${
                deletedActive
                  ? "bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {deletedActive ? "Ver Activos" : "Ver Eliminados"}
            </button>
          )}
          {onCreate && (
            <button
              onClick={onCreate}
              className="px-5 py-2 text-xs md:text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow flex items-center gap-2"
            >
              <span className="hidden sm:inline">Crear nuevo</span>
              <span className="sm:hidden text-base leading-none">＋</span>
            </button>
          )}
        </div>
      </div>

      {/* Scroll interno únicamente aquí */}
      <div className="relative w-full">
        <div
          className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <table className={`min-w-full text-[13px] sm:text-sm text-gray-700 ${compact ? "leading-tight" : "leading-normal"}`}>
            <thead className="bg-blue-100 text-blue-700">
              <tr>
                {columns.map(col => {
                  const active = sortState.key === col.key;
                  const canSort = sortableColumns.has(col.key);
                  return (
                    <th
                      key={col.key}
                      style={col.width ? { width: col.width } : undefined}
                      onClick={() => toggleSort(col)}
                      className={`px-5 py-3 font-semibold text-left whitespace-nowrap border-b border-blue-200 text-xs sm:text-[11px] md:text-xs tracking-wide select-none ${
                        col.headerClass || ""
                      } ${col.hideBelow ? hideClass(col.hideBelow) : ""} ${
                        canSort ? "cursor-pointer hover:bg-blue-200/50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span>{col.label}</span>
                        {canSort && (
                          <span className="text-[10px] opacity-70">
                            {active ? (sortState.dir === "asc" ? "▲" : "▼") : "⇅"}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
                <th className="px-5 py-3 font-semibold text-center whitespace-nowrap border-b border-blue-200 text-xs sm:text-[11px] md:text-xs tracking-wide">
                  {actionsLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-10 text-center text-blue-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse delay-150"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse delay-300"></span>
                      </div>
                      <span className="font-medium text-sm">Cargando...</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && sortedData.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-400 font-medium">
                    {emptyMessage}
                  </td>
                </tr>
              )}

              {!loading &&
                sortedData.map((row, i) => (
                  <tr
                    key={row.id ?? i}
                    className="border-t border-gray-200 hover:bg-blue-50 transition-colors group"
                  >
                    {columns.map(col => {
                      const value = row[col.key];
                      return (
                        <td
                          key={col.key}
                          className={`px-5 py-3 align-middle whitespace-nowrap max-w-xs truncate text-[13px] ${
                            col.cellClass || ""
                          } ${col.hideBelow ? hideClass(col.hideBelow) : ""}`}
                          title={typeof value === "string" ? value : undefined}
                        >
                          {col.render ? col.render(row, value) : (value ?? "—")}
                        </td>
                      );
                    })}
                    <td className="px-5 py-3 text-center whitespace-nowrap">
                      {actionsRender ? (
                        actionsRender(row)
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="px-3 py-1.5 text-[11px] sm:text-xs rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-emerald-400"
                              title="Editar"
                            >
                              <span className="hidden md:inline">Editar</span>
                              <span className="md:hidden">✎</span>
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="px-3 py-1.5 text-[11px] sm:text-xs rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-red-400"
                              title="Eliminar"
                            >
                              <span className="hidden md:inline">Eliminar</span>
                              <span className="md:hidden">🗑️</span>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-blue-50 rounded-b-2xl text-right text-[11px] sm:text-xs text-blue-700">
        Mostrando {loading ? 0 : sortedData.length} registros
      </div>
    </div>
  );
}
