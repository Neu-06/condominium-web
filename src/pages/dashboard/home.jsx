import { Link } from "react-router-dom";

export default function DashboardHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Bienvenido al Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/dashboard/usuarios" className="bg-white shadow rounded p-4 flex flex-col items-center hover:bg-gray-50 transition">
          <span className="text-blue-600 text-4xl mb-2">👤</span>
          <h2 className="font-semibold text-lg mb-1">Usuarios</h2>
          <p className="text-gray-500 text-sm text-center">Gestiona los usuarios registrados en el sistema.</p>
        </Link>
        <Link to="/dashboard/residentes" className="bg-white shadow rounded p-4 flex flex-col items-center hover:bg-gray-50 transition">
          <span className="text-green-600 text-4xl mb-2">🏢</span>
          <h2 className="font-semibold text-lg mb-1">Residentes</h2>
          <p className="text-gray-500 text-sm text-center">Administra la información de los residentes del condominio.</p>
        </Link>
        <Link to="/dashboard/areas" className="bg-white shadow rounded p-4 flex flex-col items-center hover:bg-gray-50 transition">
          <span className="text-yellow-500 text-4xl mb-2">🛠️</span>
          <h2 className="font-semibold text-lg mb-1">Áreas Comunes</h2>
          <p className="text-gray-500 text-sm text-center">Supervisa y organiza las áreas comunes y sus reservas.</p>
        </Link>
      </div>
    </div>
  );
}