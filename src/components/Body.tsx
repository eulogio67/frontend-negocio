import { useCallback, useEffect, useState } from "react";
import MostrarProductos from "./MostrarProductos";
import Categorias from "./Categorias";
import { productoService, type Producto } from "../services/productoService";

const Body = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarProductos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await productoService.obtenerTodos();
      setProductos(data);
    } catch {
      setError("No se pudieron cargar los productos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  return (
    <main className="w-full bg-gray-100">
      <section className="w-full bg-blue-900 px-6 py-16 text-center text-white">
        <h1 className="text-4xl font-bold">Nueva colección HADAJR</h1>
        <p className="mt-2 text-blue-100">Envíos a todo el Perú</p>
        <button className="mt-6 rounded-md bg-yellow-400 px-6 py-2 font-semibold text-blue-950">
          Ver ofertas
        </button>
      </section>

      <Categorias />

      <MostrarProductos
        titulo="Productos destacados"
        productos={productos}
        cargando={cargando}
        error={error}
        onReintentar={cargarProductos}
      />
    </main>
  );
};

export default Body;