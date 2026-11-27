import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import MostrarProductos from "../components/MostrarProductos";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(null);
    setProductos([]);
    setCategoria(null);

    (async () => {
      try {
        const cats = await listarCategoriasConImagen();
        if (cancelado) return;

        const cat = cats.find((c) => String(c.id) === id) ?? null;
        setCategoria(cat);

        if (cat) {
          const data = await productoService.obtenerTodos({
            categoria: cat.nombre,
          });
          if (cancelado) return;
          setProductos(data);
        }
      } catch (e) {
        if (cancelado) return;
        setError(
          e instanceof Error ? e.message : "No se pudieron cargar los productos."
        );
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();

    return () => {
      cancelado = true;
    };
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

        {!cargando && !error && !categoria && (
          <p className="text-gray-500">Esta categoría no existe.</p>
        )}

        {(cargando || categoria) && (
          <MostrarProductos
            productos={productos}
            cargando={cargando}
            error={error}
            className="px-0 py-0 pb-0"
          />
        )}
      </main>
    </div>
  );
};

export default CategoriaPage;