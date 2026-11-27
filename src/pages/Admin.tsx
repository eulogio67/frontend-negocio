import { useState, type ReactNode } from "react";
import SubirProducto from "../components/SubirProducto";
import SubirCategoria from "../components/SubirCategoria";
import EditarProductos from "../components/EditarProductos";
import PedidosAdmin from "../components/pedidosAdmin";
import EliminarAgotados from "../components/EliminarAgotados";
import ProcesarIA from "../components/ProcesarIA";
import Vender from "../components/Vender";
import Ventas from "../components/Ventas";



type Seccion =
  | "producto"
  | "categoria"
  | "cuaderno"
  | "pedidos"
  | "agotados"
  | "ia"
  | "vender"
  | "ventas";


const SECCIONES: { id: Seccion; titulo: string; componente: ReactNode }[] = [
  { id: "producto",  titulo: "Subir producto",     componente: <SubirProducto /> },
  { id: "categoria", titulo: "Categorías",         componente: <SubirCategoria /> },
  { id: "vender", titulo: "Vender", componente: <Vender /> },
  { id: "ventas", titulo: "Ventas mensuales", componente: <Ventas /> },
  { id: "cuaderno",  titulo: "Editar Productos",  componente: <EditarProductos /> },
  { id: "pedidos",   titulo: "Pedidos pendientes", componente: <PedidosAdmin /> },
  { id: "agotados",  titulo: "Eliminar agotados",  componente: <EliminarAgotados /> },
  { id: "ia",        titulo: "Procesar con IA",    componente: <ProcesarIA /> },
];

const Admin = () => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  const [abierta, setAbierta] = useState<Seccion | null>(null);

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-xl bg-white p-6 shadow-md">
          <h1 className="text-2xl font-bold text-blue-950">Administración</h1>
          <a
            href={`${import.meta.env.VITE_API_URL}/oauth2/authorization/google`}
            className="w-full rounded-md border border-gray-300 bg-white px-6 py-2 text-center font-medium text-gray-800 hover:bg-gray-50"
          >
            Iniciar sesión con Google
          </a>
        </div>
      </main>
    );
  }

  if (rol !== "ROLE_ADMIN") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 px-4">
        <p className="text-center text-gray-700">No tienes permisos para esta sección.</p>
        <a href="/" className="rounded-md bg-blue-950 px-4 py-2 text-white">Volver a la tienda</a>
      </main>
    );
  }

  const activa = SECCIONES.find((s) => s.id === abierta);

  return (
    <main className="min-h-screen bg-gray-100 py-6 sm:py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-3 sm:gap-6 sm:px-4">
          <h1 className="text-xl font-bold text-blue-950 sm:text-3xl">
            Administración 
          </h1>

        {/* Selector en móvil */}
        <div className="sm:hidden">
          <label
            htmlFor="seccion-mobile"
            className="mb-1 block text-xs font-medium uppercase text-gray-600"
          >
            Sección
          </label>
          <select
            id="seccion-mobile"
            value={abierta ?? ""}
            onChange={(e) => setAbierta((e.target.value as Seccion) || null)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Selecciona una sección</option>
            {SECCIONES.map((s) => (
              <option key={s.id} value={s.id}>{s.titulo}</option>
            ))}
          </select>
        </div>

        {/* Pestañas en escritorio */}
        <nav className="hidden w-full gap-1 overflow-x-auto border-b border-gray-300 bg-white sm:flex">
          {SECCIONES.map((s) => {
            const isActiva = abierta === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setAbierta(isActiva ? null : s.id)}
                aria-pressed={isActiva}
                className={`flex shrink-0 items-center justify-center px-5 py-3 text-sm font-semibold transition-colors ${
                  isActiva
                    ? "border-b-4 border-blue-600 text-blue-600"
                    : "border-b-4 border-transparent text-gray-500 hover:bg-gray-100"
                }`}
              >
                {s.titulo}
              </button>
            );
          })}
        </nav>

        {activa && (
          <div className="w-full rounded-b-lg bg-white p-4 shadow-sm">
            {activa.componente}
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;