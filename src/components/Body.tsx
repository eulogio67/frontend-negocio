import { useCallback, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { productoService, type Producto } from "../services/productoService";
import Categorias from "./Categorias";

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

      <Categorias />

      {/* Productos destacados */}
      <section className="py-8 pb-12">
        <div className="mb-4 flex items-baseline justify-between px-6">
          <h2 className="text-2xl font-bold text-gray-900">Productos destacados</h2>
          <span className="text-xs text-gray-500 sm:hidden">Desliza →</span>
        </div>

        {cargando && (
          <div className="px-6">
            {/* Skeletons en móvil con forma de carrusel */}
            <div className="flex gap-4 overflow-hidden sm:hidden">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-80 w-[80%] shrink-0 animate-pulse rounded-lg bg-gray-200"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">Cargando productos...</p>
          </div>
        )}

        {error && (
          <div className="mx-6 flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
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
          <p className="px-6 text-gray-500">Todavía no hay productos.</p>
        )}

        {!cargando && !error && productos.length > 0 && (
          <div
            className="
              flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2
              scroll-pl-6 scroll-pr-6
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible
              lg:grid-cols-4
            "
          >
            {productos.map((p, i) => (
              <div
                key={p.id}
                className="w-[80%] shrink-0 snap-start sm:w-auto sm:shrink"
              >
                <ProductCard producto={p} priority={i < 2} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Body;