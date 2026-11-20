import { useState, type ReactNode } from "react";
import SubirProducto from "../components/SubirProducto";
import SubirCategoria from "../components/SubirCategoria";
import CuadernoVentas from "../components/CuadernoVentas";
import PedidosAdmin from "../components/pedidosAdmin";
import EliminarAgotados from "../components/EliminarAgotados";
import logo from "../assets/hadajr_icono.svg";

type Seccion = "producto" | "categoria" | "cuaderno" | "pedidos" | "agotados";

const SECCIONES: { id: Seccion; titulo: string; componente: ReactNode }[] = [
  { id: "producto", titulo: "Subir producto", componente: <SubirProducto /> },
  { id: "categoria", titulo: "Categorías", componente: <SubirCategoria /> },
  { id: "cuaderno", titulo: "Productos y stock", componente: <CuadernoVentas /> },
  { id: "pedidos", titulo: "Pedidos pendientes", componente: <PedidosAdmin /> },
  { id: "agotados", titulo: "Eliminar agotados", componente: <EliminarAgotados /> },
];

const Admin = () => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  const [abierta, setAbierta] = useState<Seccion | null>(null);



  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-md">
          <h1 className="text-2xl font-bold text-blue-950">Administración</h1>
          <a
            href={`${import.meta.env.VITE_API_URL}/oauth2/authorization/google`}
            className="rounded-md border border-gray-300 bg-white px-6 py-2 font-medium text-gray-800 hover:bg-gray-50"
          >
            Iniciar sesión con Google
          </a>
        </div>
      </main>
    );
  }

  if (rol !== "ROLE_ADMIN") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100">
        <p className="text-gray-700">No tienes permisos para esta sección.</p>
        <a href="/" className="rounded-md bg-blue-950 px-4 py-2 text-white">Volver a la tienda</a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8">

      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4">
        {/* Encabezado: icono a la izquierda, título al costado */}
        <a href="/" className="flex items-center gap-4">
          <img src={logo} alt="HADAJR" className="h-16 w-16" />
          <h1 className="text-3xl font-bold text-blue-950">Administración HADAJR</h1>
        </a>

        {/* Barra de pestañas horizontal, tipo Facebook */}
        <nav className="flex w-full gap-1 overflow-x-auto border-b border-gray-300 bg-white">
          {SECCIONES.map((s) => {
            const activa = abierta === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setAbierta(activa ? null : s.id)}
                aria-pressed={activa}
                className={`flex shrink-0 items-center justify-center px-5 py-3 text-sm font-semibold transition-colors ${
                  activa
                    ? "border-b-4 border-blue-600 text-blue-600"
                    : "border-b-4 border-transparent text-gray-500 hover:bg-gray-100"
                }`}
              >
                {s.titulo}
              </button>
            );
          })}
        </nav>

        {/* Contenido de la sección activa, debajo de la barra */}
        {abierta && (
          <div className="w-full rounded-b-lg bg-white p-4 shadow-sm">
            {SECCIONES.find((s) => s.id === abierta)?.componente}
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;