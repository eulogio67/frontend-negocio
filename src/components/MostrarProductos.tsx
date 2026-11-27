import ProductCard from "./ProductCard";
import type { Producto } from "../types/Producto";

interface MostrarProductosProps {
  productos: Producto[];
  cargando?: boolean;
  error?: string | null;
  onReintentar?: () => void;
  titulo?: string;
  /** Texto del hint de swipe en móvil. Pasa null para ocultarlo */
  hintSwipe?: string | null;
  /** Cuántas cards cargan eager (LCP). Default: 2 */
  prioritarias?: number;
  /** Clases extra para la sección */
  className?: string;
}

const MostrarProductos = ({
  productos,
  cargando = false,
  error = null,
  onReintentar,
  titulo,
  hintSwipe = "Desliza →",
  prioritarias = 2,
  className = "",
}: MostrarProductosProps) => {
  const vacio = !cargando && !error && productos.length === 0;

  return (
    <section className={`py-8 pb-12 ${className}`}>
      {/* Encabezado: título + hint de swipe */}
      {(titulo || (hintSwipe && productos.length > 0 && !cargando)) && (
        <div className="mb-4 flex items-baseline justify-between px-6">
          {titulo && (
            <h2 className="text-2xl font-bold text-gray-900">{titulo}</h2>
          )}
          {hintSwipe && productos.length > 0 && !cargando && (
            <span className="text-xs text-gray-500 sm:hidden">{hintSwipe}</span>
          )}
        </div>
      )}

      {/* Estado: cargando → skeletons */}
      {cargando && (
        <div className="px-6">
          {/* Skeletons carrusel (móvil) */}
          <div className="flex gap-4 overflow-hidden sm:hidden">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-80 w-[80%] shrink-0 animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
          {/* Skeletons grid (escritorio) */}
          <div className="hidden grid-cols-2 gap-6 sm:grid lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        </div>
      )}

      {/* Estado: error */}
      {error && (
        <div className="mx-6 flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          <span className="text-sm">{error}</span>
          {onReintentar && (
            <button
              type="button"
              onClick={onReintentar}
              className="shrink-0 rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
            >
              Reintentar
            </button>
          )}
        </div>
      )}

      {/* Estado: vacío */}
      {vacio && (
        <p className="px-6 text-gray-500">Todavía no hay productos.</p>
      )}

      {/* Productos: carrusel móvil + grid desktop */}
      {!cargando && !error && productos.length > 0 && (
        <div
          className="
            flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2
            scroll-pl-6 scroll-pr-6
            scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
            sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-6
            lg:grid-cols-4
          "
        >
          {productos.map((p, i) => (
            <div
              key={p.id}
              className="w-[80%] shrink-0 snap-start sm:w-auto sm:shrink"
            >
              <ProductCard producto={p} priority={i < prioritarias} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MostrarProductos;