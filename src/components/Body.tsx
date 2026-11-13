import { useCallback, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import SubirProducto from "./SubirProducto";
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
      {/* Banner principal */}
      <section className="w-full bg-blue-900 px-6 py-16 text-center text-white">
        <h1 className="text-4xl font-bold">Nueva colección HADAJR</h1>
        <p className="mt-2 text-blue-100">Envíos a todo el Perú</p>
        <button className="mt-6 rounded-md bg-yellow-400 px-6 py-2 font-semibold text-blue-950">
          Ver ofertas
        </button>
      </section>

      <SubirProducto onCreado={cargarProductos} />

      {/* Categorías */}
      <section className="px-6 py-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Categorías</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {["Polos", "Casacas", "Pantalones", "Sandalias"].map((cat) => (
            <a
              key={cat}
              href="#"
              className="rounded-lg bg-white p-6 text-center font-medium shadow hover:shadow-md"
            >
              {cat}
            </a>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="px-6 pb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Productos destacados</h2>

        {cargando && <p className="text-gray-500">Cargando productos...</p>}

        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            <span>{error}</span>
            <button
              onClick={cargarProductos}
              className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && productos.length === 0 && (
          <p className="text-gray-500">Todavía no hay productos.</p>
        )}

        {!cargando && !error && productos.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {productos.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Body;