import React, { useState, useEffect } from "react";
import { setToken, setUser } from "../services/auth.js";
import { api } from "../services/apiClient";

export default function Login() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log("🔐 Enviando login a /api/cuenta/token/");
      const response = await api.post("/api/cuenta/token/", formData);
      console.log("✅ Respuesta login:", response);
      setToken(response.access);

      const perfil = await api.get("/api/cuenta/perfil/");
      setUser(perfil);
      const rol = (perfil.rol || "").toUpperCase();
      window.location.href =
        rol === "ADMIN" || rol === "ADMINISTRADOR" ? "/dashboard" : "/";
    } catch (err) {
      console.error("❌ Error login:", err);
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
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingresa tu usuario"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingresa tu contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
