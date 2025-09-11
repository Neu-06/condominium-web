import React, { useState } from "react";

export default function Register() {
  const [show, setShow] = useState(false);
  React.useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div
        className={`w-full max-w-md bg-white rounded-3xl shadow-2xl p-5 transition-all duration-700 ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
        style={{ boxShadow: "0 8px 32px 0 rgba(60,130,246,0.15)" }}
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center drop-shadow">Registrate</h1>
        <form className="space-y-6">
          <input
            className="w-full border border-blue-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition"
            placeholder="Nombre completo"
            name="nombre"
            autoComplete="name"
            required
          />
          <input
            className="w-full border border-blue-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition"
            placeholder="Teléfono"
            name="telefono"
            type="tel"
            autoComplete="tel"
            required
          />
          <input
            className="w-full border border-blue-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition"
            placeholder="Correo electrónico"
            name="correo"
            type="email"
            autoComplete="email"
            required
          />
          <input
            className="w-full border border-blue-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition"
            placeholder="Contraseña"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          <input
            className="w-full border border-blue-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition"
            placeholder="Fecha de nacimiento"
            name="fecha_nacimiento"
            type="date"
            required
          />
          <select
            className="w-full border border-blue-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition"
            name="sexo"
            required
          >
            <option value="">Sexo</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-2xl px-4 py-3 font-semibold text-lg shadow hover:bg-blue-700 transition-all duration-300 hover:scale-105"
          >
            Registrarse
          </button>
        </form>
      </div>
    </section>
  );
}
