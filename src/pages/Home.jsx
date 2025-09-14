import React from "react";
import home_img from '../assets/home_img.webp';
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 relative overflow-hidden">
      
      <span className="absolute top-0 left-0 w-40 h-40 bg-blue-200 rounded-full blur-2xl opacity-30 -z-10" />
      <span className="absolute bottom-0 right-0 w-56 h-56 bg-blue-300 rounded-full blur-3xl opacity-20 -z-10" />

      <img
        src={home_img}
        alt="Condominio inteligente"
        className="mb-8 rounded-2xl shadow-xl w-full max-w-md object-cover border-4 border-blue-100"
      />

      <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4 text-center drop-shadow">
        ¡Bienvenido a Smart Condominium!
      </h1>
      <p className="text-lg md:text-xl text-gray-700 text-center max-w-xl mb-8">
        Tu espacio, tu comunidad, tu tecnología.<br />
        Gestiona pagos, reservas y servicios de forma fácil y segura.<br />
        Disfruta la experiencia de vivir en un condominio inteligente.
      </p>

      <Link
        to="/login"
        className="inline-block px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition mb-4"
      >
        Acceder a mi cuenta
      </Link>

    </div>
  );
}
