import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { clearAuth, getUser } from "../services/auth.js";

const menu = [
	{
		grupo: "Acceso y Seguridad",
		icono: "🔑",
		opciones: [
			{ nombre: "Cuentas", ruta: "/dashboard/usuarios" },
			{ nombre: "Roles", ruta: "/dashboard/usuarios/roles" },
			{ nombre: "Bitacora", ruta: "/dashboard/usuarios/bitacora" },
			{ nombre: "Avisos", ruta: "/dashboard/avisos" },
		],
	},
	{
		grupo: "Comunidad",
		icono: "🏢",
		opciones: [
			{ nombre: "Residentes", ruta: "/dashboard/residentes" },
			{ nombre: "Residencias", ruta: "/dashboard/residencias" },
			{ nombre: "Vehículos", ruta: "/dashboard/vehiculos" },
			{ nombre: "Mascotas", ruta: "/dashboard/mascotas" },
			{ nombre: "Visitantes", ruta: "/dashboard/visitantes" },
		],
	},

	{grupo: "Personal",
		icono: "👷", opciones: [
			{ nombre: "Personal", ruta: "/dashboard/personal" },
			{ nombre: "Tareas", ruta: "/dashboard/tareas" },
		],
	},

	{
		grupo: "Áreas Comunes",
		icono: "🛠️",
		opciones: [
			{ nombre: "Áreas Comunes", ruta: "/dashboard/areas" },
			{ nombre: "Reglas", ruta: "/dashboard/areas/reglas" },
			{ nombre: "Horarios", ruta: "/dashboard/areas/horarios" },
		],
	},
	{
		grupo: "Reservas y Pagos",
		icono: "💳",
		opciones: [
			{ nombre: "Pagos", ruta: "/dashboard/pagos" },
			{ nombre: "Facturas", ruta: "/dashboard/facturas" },
			{ nombre: "Concepto Pago", ruta: "/dashboard/conceptos-pago" },
			{ nombre: "Reservas", ruta: "/dashboard/reservas" },
		],
	},
];

export default function AdminLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [openGroup, setOpenGroup] = useState(null);
	const location = useLocation();
	const user = getUser(); // se usa abajo

	// Cierra sidebar al cambiar de ruta en móvil
	useEffect(() => {
		if (window.innerWidth < 1024) setSidebarOpen(false);
	}, [location.pathname]);

	// Bloquea scroll body al abrir en móvil
	useEffect(() => {
		if (sidebarOpen && window.innerWidth < 1024) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => (document.body.style.overflow = "");
	}, [sidebarOpen]);

	// ESC para cerrar
	useEffect(() => {
		const handler = (e) => e.key === "Escape" && setSidebarOpen(false);
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);

	function handleLogout() {
		clearAuth();
		window.location.href = "/login";
	}

	return (
		<div className="min-h-screen flex overflow-x-hidden">
			{/* Sidebar */}
			<aside
				className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-gray-100 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
			>
				<div className="flex flex-col h-full">
					<div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
						<h1 className="text-lg font-semibold">Administración</h1>
						<button
							className="lg:hidden text-2xl leading-none"
							aria-label="Cerrar menú"
							onClick={() => setSidebarOpen(false)}
						>
							&times;
						</button>
					</div>

					<nav className="flex-1 overflow-y-auto px-2 py-4">
						<ul className="space-y-1">
							<li>
								<Link
									to="/dashboard"
									className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition ${
										location.pathname === "/dashboard" ? "bg-gray-800" : ""
									}`}
								>
									<span>🏠</span>
									<span>Dashboard</span>
								</Link>
							</li>
							{menu.map((grupo, idx) => {
								const abierto = openGroup === idx;
								return (
									<li key={grupo.grupo}>
										<button
											type="button"
											onClick={() => setOpenGroup(abierto ? null : idx)}
											className="w-full flex items-center justify-between px-4 py-2 rounded hover:bg-gray-700 transition font-medium"
											aria-expanded={abierto}
										>
											<span className="flex items-center gap-3">
												<span>{grupo.icono}</span>
												{grupo.grupo}
											</span>
											<span className="text-xs">{abierto ? "▲" : "▼"}</span>
										</button>
										{abierto && (
											<ul className="mt-1 ml-5 space-y-1">
												{grupo.opciones.map((op) => (
													<li key={op.ruta}>
														<Link
															to={op.ruta}
															className={`block px-3 py-2 rounded hover:bg-gray-700 text-sm transition ${
																location.pathname === op.ruta
																	? "bg-gray-800"
																	: ""
															}`}
														>
															{op.nombre}
														</Link>
													</li>
												))}
											</ul>
										)}
									</li>
								);
							})}
						</ul>
					</nav>

					{/* Botones extras */}
					<div className="px-4 py-4 border-t border-gray-700 space-y-2">
						<Link
							to="/"
							onClick={() => setSidebarOpen(false)}
							className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-md transition"
						>
							<span>🏡</span>
							<span>Home</span>
						</Link>
						<button
							onClick={handleLogout}
							className="w-full px-3 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
						>
							Cerrar sesión
						</button>
						<div className="text-[11px] text-gray-500 pt-1 text-center select-none">
							© {new Date().getFullYear()}
						</div>
					</div>
				</div>
			</aside>

			{/* Overlay móvil */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Contenido */}
			<div className="flex flex-col lg:pl-64 min-h-screen w-full">
				{/* Topbar móvil */}
				<header className="flex items-center justify-between bg-white shadow px-4 py-3 lg:hidden">
					<button
						className="text-2xl"
						aria-label="Abrir menú"
						onClick={() => setSidebarOpen(true)}
					>
						☰
					</button>
					<span className="font-semibold">Panel</span>
					<span className="w-6" />
				</header>

				<main className="flex-1 flex flex-col w-full">
					<div
						className="w-full mx-auto max-w-7xl px-3 sm:px-5 md:px-8 py-4 md:py-6 flex flex-col gap-4"
					>
						{/* Info usuario */}
						{user && (
							<div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs md:text-sm text-gray-600">
								<span className="px-2 py-1 rounded bg-gray-100">
									{user.nombre} {user.apellido}
								</span>
								<span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
									{user.rol}
								</span>
							</div>
						)}
						{/* Contenido principal */}
						<div className="w-full min-w-0">
							{/* Contenedor que evita scroll horizontal de toda la página */}
							<div className="w-full overflow-x-auto">
								<Outlet />
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}