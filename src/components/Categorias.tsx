import { useEffect, useState } from "react";
import {
  listarCategoriasConImagen,
  type CategoriaConImagen,
} from "../services/categoriaService";

const POR_PAGINA = 5;

const Categorias = () => {
  const [categorias, setCategorias] = useState<CategoriaConImagen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(0);

  useEffect(() => {
    listarCategoriasConImagen()
      .then(setCategorias)
      .catch((e: Error) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const totalPaginas = Math.max(1, Math.ceil(categorias.length / POR_PAGINA));
  const ultimaPagina = totalPaginas - 1;

  const anterior = () => setPagina((p) => Math.max(0, p - 1));
  const siguiente = () => setPagina((p) => Math.min(ultimaPagina, p + 1));

  return (
    <section className="px-6 py-8">
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">Categorías</h2>

      {cargando && <p className="text-center text-gray-500">Cargando categorías...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!cargando && !error && categorias.length === 0 && (
        <p className="text-center text-gray-500">No hay categorías disponibles.</p>
      )}

      {!cargando && !error && categorias.length > 0 && (
        <div className="relative flex items-center">
          {/* Botón izquierdo */}
          <button
            type="button"
            onClick={anterior}
            disabled={pagina === 0}
            aria-label="Categorías anteriores"
            className="absolute -left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          {/* Ventana: oculta lo que no está en la página actual */}
          <div className="overflow-hidden px-6 w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${pagina * 100}%)` }}
            >
              {Array.from({ length: totalPaginas }, (_, i) => (
                <div
                  key={i}
                  className="grid w-full shrink-0 grid-cols-2 gap-4 md:grid-cols-5"
                >
                  {categorias
                    .slice(i * POR_PAGINA, i * POR_PAGINA + POR_PAGINA)
                    .map((cat) => (
                      <a
                        key={cat.id}
                        href={`/categorias/${cat.id}`}
                        className="group flex flex-col"
                      >
                        <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-md bg-gradient-to-b from-orange-50 to-gray-100">
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
              ))}
            </div>
          </div>

          {/* Botón derecho */}
          <button
            type="button"
            onClick={siguiente}
            disabled={pagina === ultimaPagina}
            aria-label="Siguientes categorías"
            className="absolute -right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default Categorias;