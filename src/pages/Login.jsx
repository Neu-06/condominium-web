import React, { useState } from "react";

export default function Login() {
  const [show, setShow] = useState(false);
  React.useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div
        className={`w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transition-all duration-700 ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
        style={{ boxShadow: "0 8px 32px 0 rgba(60,130,246,0.15)" }}
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center drop-shadow">Iniciar sesión</h1>
        <form className="space-y-6">
          <input
            className="w-full border border-blue-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition"
            placeholder="Correo electrónico"
            type="email"
            autoComplete="email"
            required
          />
          <input
            className="w-full border border-blue-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition"
            placeholder="Contraseña"
            type="password"
            autoComplete="current-password"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-2xl px-4 py-3 font-semibold text-lg shadow hover:bg-blue-700 transition-all duration-300 hover:scale-105"
          >
            Entrar
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="#" className="text-blue-500 hover:underline text-sm">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </section>
  );
}
