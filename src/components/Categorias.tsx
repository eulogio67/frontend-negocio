import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listarCategoriasConImagen,
  type CategoriaConImagen,
} from "../services/categoriaService";

const POR_PAGINA = 4; // 2×2 en móvil, 4 en fila en escritorio

const IconoChevron = ({ direccion }: { direccion: "izq" | "der" }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {direccion === "izq" ? (
      <polyline points="15 18 9 12 15 6" />
    ) : (
      <polyline points="9 18 15 12 9 6" />
    )}
  </svg>
);

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

  const hayMuchas = totalPaginas > 1;

  return (
    <section className="px-3 py-8 sm:px-6">
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">Categorías</h2>

      {cargando && <p className="text-center text-gray-500">Cargando categorías...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!cargando && !error && categorias.length === 0 && (
        <p className="text-center text-gray-500">No hay categorías disponibles.</p>
      )}

      {!cargando && !error && categorias.length > 0 && (
        <div className="flex items-center gap-2">
          {hayMuchas && (
            <button
              type="button"
              onClick={anterior}
              disabled={pagina === 0}
              aria-label="Página anterior de categorías"
              aria-disabled={pagina === 0}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-950 shadow-md hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <IconoChevron direccion="izq" />
            </button>
          )}

          <div className="min-w-0 flex-1 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${pagina * 100}%)` }}
            >
              {Array.from({ length: totalPaginas }, (_, i) => (
                <div
                  key={i}
                  className="grid w-full shrink-0 grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
                >
                  {categorias
                    .slice(i * POR_PAGINA, i * POR_PAGINA + POR_PAGINA)
                    .map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/categorias/${cat.id}`}
                        className="group flex flex-col"
                      >
                        <div className="flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-md bg-linear-to-b from-orange-50 to-gray-100">
                          {cat.imageUrl ? (
                            <img
                              src={cat.imageUrl}
                              alt={cat.nombre}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-contain p-2 transition group-hover:scale-105"
                            />
                          ) : (
                            <span className="px-2 text-center text-sm text-gray-400">
                              Sin imagen
                            </span>
                          )}
                        </div>
                        <span className="mt-2 truncate text-sm font-medium text-gray-900 group-hover:text-orange-600 sm:text-base">
                          {cat.nombre}
                        </span>
                      </Link>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {hayMuchas && (
            <button
              type="button"
              onClick={siguiente}
              disabled={pagina === ultimaPagina}
              aria-label="Página siguiente de categorías"
              aria-disabled={pagina === ultimaPagina}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-950 shadow-md hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <IconoChevron direccion="der" />
            </button>
          )}
        </div>
      )}

      {/* Puntos indicadores (opcional, ayuda en móvil) */}
      {!cargando && !error && hayMuchas && (
        <div className="mt-3 flex justify-center gap-1.5">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPagina(i)}
              aria-label={`Ir a la página ${i + 1}`}
              aria-current={pagina === i ? "true" : undefined}
              className={`h-2 rounded-full transition-all ${
                pagina === i ? "w-6 bg-blue-950" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Categorias;