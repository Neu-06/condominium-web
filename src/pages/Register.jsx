import React, { useState } from "react";
import { api } from "../services/apiClient"; // asegúrate que existe este helper
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ nombre: "", apellido: "", correo: "", password: "" });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  function setField(k, v) {
    setForm(f => ({ ...f, [k]: v }));
  }

  const invalid = {
    nombre: touched.nombre && !form.nombre.trim(),
    apellido: touched.apellido && !form.apellido.trim(),
    correo: touched.correo && !form.correo.trim(),
    password: touched.password && form.password.length < 4
  };

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ nombre: true, apellido: true, correo: true, password: true });
    if (invalid.nombre || invalid.apellido || invalid.correo || invalid.password) return;
    setLoading(true);
    setError("");
    api.post("/api/cuenta/registro/", {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      correo: form.correo.trim(),
      password: form.password
    })
      .then(() => {
        setOk(true);
        setTimeout(() => navigate("/login"), 1500);
      })
      .catch(err => setError(err.message || "Error"))
      .finally(() => setLoading(false));
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div
        className={`w-full max-w-md bg-white rounded-3xl shadow-2xl p-5 transition-all duration-700 ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
        style={{ boxShadow: "0 8px 32px 0 rgba(60,130,246,0.15)" }}
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center drop-shadow">Registrate</h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}
        {ok && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
            Cuenta creada. Redirigiendo...
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <input
            className={`w-full border ${invalid.nombre ? "border-red-400" : "border-blue-200"} rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition`}
            placeholder="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={e => setField("nombre", e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, nombre: true }))}
            required
          />
          <input
            className={`w-full border ${invalid.apellido ? "border-red-400" : "border-blue-200"} rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition`}
            placeholder="Apellido"
            name="apellido"
            value={form.apellido}
            onChange={e => setField("apellido", e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, apellido: true }))}
            required
          />
          <input
            className={`w-full border ${invalid.correo ? "border-red-400" : "border-blue-200"} rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition`}
            placeholder="Correo electrónico"
            name="correo"
            type="email"
            value={form.correo}
            onChange={e => setField("correo", e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, correo: true }))}
            required
          />
          <input
            className={`w-full border ${invalid.password ? "border-red-400" : "border-blue-200"} rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition`}
            placeholder="Contraseña (mín 4)"
            name="password"
            type="password"
            value={form.password}
            onChange={e => setField("password", e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, password: true }))}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-2xl px-4 py-3 font-semibold text-lg shadow hover:bg-blue-700 transition-all duration-300 hover:scale-105 disabled:opacity-60"
          >
            {loading ? "Creando..." : "Registrarse"}
          </button>
        </form>
      </div>
    </section>
  );
}
