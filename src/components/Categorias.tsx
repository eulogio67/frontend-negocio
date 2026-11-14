import { useEffect, useState } from "react";
import {
  listarCategoriasConImagen,
  type CategoriaConImagen,
} from "../services/categoriaService";

const POR_PAGINA = 4;

const Categorias = () => {
  const [categorias, setCategorias] = useState<CategoriaConImagen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibles, setVisibles] = useState(POR_PAGINA);

  useEffect(() => {
    listarCategoriasConImagen()
      .then(setCategorias)
      .catch((e: Error) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const mostradas = categorias.slice(0, visibles);
  const hayMas = visibles < categorias.length;

  return (
    <section className="px-6 py-8">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">Categorías</h2>

      {cargando && <p className="text-gray-500">Cargando categorías...</p>}

      {error && <p className="text-red-600">{error}</p>}

      {!cargando && !error && categorias.length === 0 && (
        <p className="text-gray-500">No hay categorías disponibles.</p>
      )}

      {!cargando && !error && categorias.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {mostradas.map((cat) => (
              <a
                key={cat.id}
                href={`/categorias/${cat.id}`}
                className="group flex flex-col items-start"
              >
                <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-gradient-to-b from-orange-50 to-gray-100">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.nombre}
                      loading="lazy"
                      className="h-full w-full object-contain p-2 transition group-hover:scale-105"
                    />
                  ) : (
                    <span className="px-2 text-center text-sm text-gray-400">
                      Sin imagen
                    </span>
                  )}
                </div>
                <span className="mt-2 text-base font-medium text-gray-900 group-hover:text-orange-600">
                  {cat.nombre}
                </span>
              </a>
            ))}
          </div>

          {hayMas && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibles((v) => v + POR_PAGINA)}
                className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Ver más
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Categorias;