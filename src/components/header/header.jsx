import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-horizontal.svg"
function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 py-2">
          <img src={logo} alt="Condominium Smart Living" className="h-12 w-auto" />
        </Link>

        {/* Menú desktop */}
        <ul className="hidden lg:flex items-center gap-8 text-base font-medium">
          <ListItem to="/">Inicio</ListItem>
          <ListItem to="/">Pagos</ListItem>
          <ListItem to="/">Acerca</ListItem>
          <ListItem to="/dashboard">Blog</ListItem>
        </ul>

        {/* Botones desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <Link to="/login" className="px-5 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold">Iniciar sesión</Link>
          <Link to="/register" className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700">Registrar</Link>
        </div>

        {/* Hamburguesa móvil */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Abrir menú"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-7 h-7"
          >
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
                <line x1="6" y1="18" x2="18" y2="6" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" strokeWidth="2" strokeLinecap="round" />
                <line x1="4" y1="12" x2="20" y2="12" strokeWidth="2" strokeLinecap="round" />
                <line x1="4" y1="17" x2="20" y2="17" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-md">
          <ul className="flex flex-col gap-2 px-4 py-4 text-base font-medium">
            <ListItem to="/">Inicio</ListItem>
            <ListItem to="/">Pagos</ListItem>
            <ListItem to="/">Acerca</ListItem>
            <ListItem to="/">Blog</ListItem>
            {/* Botones de sesión en móvil */}
            <li className="mt-2 flex gap-2">
              <Link to="/login" className="flex-1 px-5 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-center">Iniciar sesión</Link>
              <Link to="/register" className="flex-1 px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 text-center">Registrar</Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

function ListItem({ children, to }) {
  return (
    <li>
      <Link
        to={to}
        className="block px-2 py-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition"
      >
        {children}
      </Link>
    </li>
  );
}

export default Header;