import React, { useState, useEffect } from "react";
import { setToken, setUser } from "../services/auth.js";
import { api } from "../services/apiClient";

export default function Login() {
  const [show, setShow] = useState(false);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bloqueado, setBloqueado] = useState(false);
  const [intentosRestantes, setIntentosRestantes] = useState(3);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      console.log("🔐 Enviando login a /api/cuenta/token/");
      const data = await api.post("/api/cuenta/token/", { correo, password });
      console.log("✅ Respuesta login:", data);

      if (!data.access) {
        throw new Error("No se recibió token de acceso");
      }

      setToken(data.access);
      console.log("👤 Obteniendo perfil del usuario...");
      const perfil = await api.get("/api/cuenta/perfil/");
      setUser(perfil);
      
      const rol = (perfil.rol || "").toUpperCase();
      window.location.href = rol === "ADMIN" || rol === "ADMINISTRADOR" ? "/dashboard" : "/";
      
    } catch (err) {
      console.error("❌ Error login:", err);
      
      if (err.status === 423) {
        // Usuario bloqueado
        setBloqueado(true);
        if (err.data?.debe_recuperar) {
          setError("Usuario bloqueado. Serás redirigido a recuperación de contraseña...");
          setTimeout(() => {
            window.location.href = "/recuperar-password";
          }, 3000);
        } else {
          const minutos = err.data?.minutos_restantes || 30;
          setError(`Usuario bloqueado por ${minutos} minutos. Intenta más tarde.`);
        }
      } else if (err.status === 401) {
        const intentos = err.data?.intentos_restantes;
        if (intentos !== undefined) {
          setIntentosRestantes(intentos);
          setError(`Credenciales incorrectas. Te quedan ${intentos} intentos.`);
          if (intentos === 0) {
            setTimeout(() => {
              window.location.href = "/recuperar-password";
            }, 2000);
          }
        } else {
          setError("Correo o contraseña incorrectos");
        }
      } else if (err.message.includes("404")) {
        setError("Servicio no disponible. Intenta más tarde.");
      } else {
        setError(err.message || "Error de conexión");
      }
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
        
        {intentosRestantes < 3 && !bloqueado && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm text-center">
            ⚠️ Te quedan {intentosRestantes} intentos antes del bloqueo
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            className="w-full border border-blue-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Correo"
            type="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={loading || bloqueado}
          />
          <input
            className="w-full border border-blue-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Contraseña"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || bloqueado}
          />
          <button
            type="submit"
            disabled={loading || bloqueado}
            className="w-full bg-blue-600 text-white rounded-2xl px-4 py-3 font-semibold text-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => window.location.href = "/recuperar-password"}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          
          {error && (
            <div className={`text-sm text-center p-3 rounded-xl ${
              bloqueado ? 'bg-red-50 text-red-600 border border-red-200' : 'text-red-500'
            }`}>
              {error}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
