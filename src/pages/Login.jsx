import React, { useState, useEffect } from "react";
import { setToken, setUser } from "../services/auth.js";
import { api } from "../services/apiClient.js";

export default function Login() {
  const [show, setShow] = useState(false);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/cuenta/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Credenciales inválidas");
      setToken(data.access);

      const perfil = await api.get("/api/cuenta/perfil/");
      setUser(perfil);
      const rol = (perfil.rol || "").toUpperCase();
      window.location.href =
        rol === "ADMIN" || rol === "ADMINISTRADOR" ? "/dashboard" : "/";
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div
        className={`w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transition-all duration-700 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Iniciar sesión
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            className="w-full border border-blue-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Correo"
            type="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <input
            className="w-full border border-blue-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Contraseña"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-2xl px-4 py-3 font-semibold text-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
        </form>
      </div>
    </section>
  );
}
