import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import {
  listarCategoriasConImagen,
  type CategoriaConImagen,
} from "../services/categoriaService";
import { productoService } from "../services/productoService";
import type { Producto } from "../types/Producto";

const CategoriaPage = () => {
  const { id } = useParams<{ id: string }>();
  const [categoria, setCategoria] = useState<CategoriaConImagen | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    listarCategoriasConImagen().then(async (cats) => {
      const cat = cats.find((c) => String(c.id) === id) ?? null;
      setCategoria(cat);
      if (cat) setProductos(await productoService.obtenerTodos(cat.nombre));
      setCargando(false);
    });
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link to="/" className="text-sm text-blue-900 underline">
          ← Volver a la tienda
        </Link>
        <h1 className="my-4 text-2xl font-bold text-gray-900">
          {categoria?.nombre ?? "Categoría"}
        </h1>

        {cargando && (
          <>
            {/* Skeletons en forma de carrusel (móvil) */}
            <div className="-mx-4 flex gap-4 overflow-hidden px-4 sm:hidden">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-80 w-[80%] shrink-0 animate-pulse rounded-lg bg-gray-200"
                />
              ))}
            </div>
            {/* Skeletons en grid (desktop) */}
            <div className="hidden grid-cols-2 gap-6 sm:grid lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-lg bg-gray-200" />
              ))}
            </div>
          </>
        )}

        {!cargando && productos.length === 0 && (
          <p className="text-gray-500">No hay productos en esta categoría.</p>
        )}

        {!cargando && productos.length > 0 && (
          <>
            {/* Hint de swipe en móvil */}
            <span className="mb-2 block text-xs text-gray-500 sm:hidden">
              Desliza →
            </span>

            <div
              className="
                -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2
                scroll-pl-4 scroll-pr-4
                [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
                sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0
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
          </>
        )}
      </main>
    </div>
  );
};

export default CategoriaPage;