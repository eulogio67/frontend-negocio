import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productoService, type Producto } from "../services/productoService";
import {
  listarCategoriasConImagen,
  type CategoriaConImagen,
} from "../services/categoriaService";

const formatoPrecio = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

const cacheBusqueda = new Map<string, Producto[]>();
const MAX_CACHE = 30;

const guardarEnCache = (key: string, data: Producto[]) => {
  if (cacheBusqueda.size >= MAX_CACHE) {
    const primera = cacheBusqueda.keys().next().value;
    if (primera) cacheBusqueda.delete(primera);
  }
  cacheBusqueda.set(key, data);
};

const IconoLupa = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const useCategorias = () => {
  const [categorias, setCategorias] = useState<CategoriaConImagen[]>([]);
  useEffect(() => {
    listarCategoriasConImagen()
      .then(setCategorias)
      .catch(() => setCategorias([]));
  }, []);
  return categorias;
};

const useBusqueda = (
  texto: string,
  categoriaId: number | null,
  espera = 300
) => {
  const [resultados, setResultados] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const termino = texto.trim();
    if (!termino && !categoriaId) {
      setResultados([]);
      setCargando(false);
      setFallback(false);
      return;
    }

    const key = `${termino}::${categoriaId ?? "all"}`;
    const enCache = cacheBusqueda.get(key);
    if (enCache) {
      setResultados(enCache);
      setCargando(false);
      setFallback(false);
      return;
    }

    let cancelado = false;
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setCargando(true);
      setFallback(false);
      try {
        let data = await productoService.buscar(termino, {
          categoriaId: categoriaId ?? undefined,
          signal: controller.signal,
        });

        // Fallback: si hay categoría + texto y no hay resultados,
        // buscar el texto sin restricción de categoría
        if (data.length === 0 && categoriaId && termino) {
          data = await productoService.buscar(termino, {
            signal: controller.signal,
          });
          if (!cancelado) setFallback(true);
        }

        if (!cancelado) {
          guardarEnCache(key, data);
          setResultados(data);
        }
      } catch (e) {
        if (!cancelado && (e as Error).name !== "AbortError") {
          setResultados([]);
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    }, espera);

    return () => {
      cancelado = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [texto, categoriaId, espera]);

  return { resultados, cargando, fallback };
};

const Buscador = () => {
  const [texto, setTexto] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [dropdownCat, setDropdownCat] = useState(false);
  const [categoriaSel, setCategoriaSel] = useState<CategoriaConImagen | null>(null);

  const contenedorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const categorias = useCategorias();
  const { resultados, cargando, fallback } = useBusqueda(
    texto,
    categoriaSel?.id ?? null
  );

  const mostrarPanel = abierto && (texto.trim().length > 0 || categoriaSel !== null);

  useEffect(() => {
    const onClickFuera = (e: MouseEvent) => {
      if (!contenedorRef.current?.contains(e.target as Node)) {
        setDropdownCat(false);
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", onClickFuera);
    return () => document.removeEventListener("mousedown", onClickFuera);
  }, []);

  // Toggle: si ya estaba seleccionada, la deselecciona
  const elegirCategoria = (c: CategoriaConImagen) => {
    if (categoriaSel?.id === c.id) {
      setCategoriaSel(null);
    } else {
      setCategoriaSel(c);
    }
    setDropdownCat(false);
    setAbierto(true);
  };

  const quitarFiltro = () => {
    setCategoriaSel(null);
    setAbierto(true);
  };

  const prefetchProducto = (id: number) => {
    const key = `producto:${id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    productoService.obtenerPorId(id).catch(() => {});
  };

  return (
    <div
      ref={contenedorRef}
      className="relative mx-2 flex w-full max-w-3xl flex-1 sm:mx-4"
    >
      <div className="flex w-full">
        <button
          type="button"
          onClick={() => setDropdownCat((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={dropdownCat}
          className="flex max-w-[45%] shrink-0 items-center gap-1 rounded-l-md bg-gray-200 px-2 py-2 text-sm text-black hover:bg-gray-300 sm:max-w-none sm:gap-2 sm:px-3"
        >
          <i className="fa-solid fa-bars hidden shrink-0 text-xs sm:block"></i>
          <span className="truncate">
            {categoriaSel ? categoriaSel.nombre : "Todos"}
          </span>
          <i
            className={`fa-solid fa-chevron-down shrink-0 text-xs transition-transform ${
              dropdownCat ? "rotate-180" : ""
            }`}
          ></i>
        </button>

        <input
          type="text"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setAbierto(true);
          }}
          onFocus={() => setAbierto(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setAbierto(false);
            if (e.key === "Enter" && resultados[0]) {
              navigate(`/producto/${resultados[0].id}`);
              setAbierto(false);
            }
          }}
          placeholder={
            categoriaSel ? `Buscar en ${categoriaSel.nombre}...` : "Polos de Hombre"
          }
          className="min-w-0 flex-1 bg-white px-3 py-2 text-black outline-none"
        />

        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Buscar"
          className="flex shrink-0 items-center justify-center rounded-r-md bg-yellow-400 px-4 text-black hover:bg-yellow-500"
        >
          <IconoLupa />
        </button>
      </div>

      {dropdownCat && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-[60] mt-1 max-h-80 w-72 max-w-[90vw] overflow-y-auto rounded-md bg-white py-1 shadow-lg"
        >
          {/* Chip para quitar filtro (solo si hay una categoría activa) */}
          {categoriaSel && (
            <div className="border-b px-3 py-2">
              <button
                type="button"
                onClick={quitarFiltro}
                className="flex w-full items-center gap-2 rounded bg-gray-100 px-2 py-1 text-left text-xs font-medium text-gray-700 hover:bg-gray-200"
              >
                <span className="truncate">Filtro: {categoriaSel.nombre}</span>
                <span className="ml-auto shrink-0 text-red-600">✕</span>
              </button>
            </div>
          )}

          {categorias.length === 0 && (
            <p className="px-3 py-2 text-sm text-gray-500">Cargando categorías...</p>
          )}

          {categorias.map((c) => {
            const activa = categoriaSel?.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="option"
                aria-selected={activa}
                onClick={() => elegirCategoria(c)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                  activa ? "bg-gray-50 font-semibold text-blue-950" : ""
                }`}
              >
                {c.imageUrl ? (
                  <img
                    src={c.imageUrl}
                    alt=""
                    loading="lazy"
                    className="h-6 w-6 shrink-0 rounded object-cover"
                  />
                ) : (
                  <span className="h-6 w-6 shrink-0 rounded bg-gray-200" />
                )}
                <span className="truncate">{c.nombre}</span>
                {activa && (
                  <i className="fa-solid fa-check ml-auto text-xs text-blue-950"></i>
                )}
              </button>
            );
          })}
        </div>
      )}

      {mostrarPanel && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-md bg-white shadow-lg">
          {cargando && resultados.length === 0 && (
            <div className="flex flex-col gap-3 p-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex animate-pulse items-center gap-3">
                  <div className="h-12 w-12 rounded bg-gray-200" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-1/3 rounded bg-gray-200" />
                  </div>
                  <div className="h-4 w-12 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          )}

          {/* Aviso de fallback */}
          {!cargando && fallback && resultados.length > 0 && (
            <p className="border-b bg-blue-50 px-3 py-2 text-xs text-blue-900">
              Sin resultados en <strong>{categoriaSel?.nombre}</strong>. Mostrando
              resultados de todas las categorías.
            </p>
          )}

          {!cargando && resultados.length === 0 && (
            <p className="p-4 text-sm text-gray-500">
              {categoriaSel && !texto.trim()
                ? `No hay productos en "${categoriaSel.nombre}".`
                : `No encontramos productos para "${texto.trim()}".`}
            </p>
          )}

          {resultados.map((p) => (
            <Link
              key={p.id}
              to={`/producto/${p.id}`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => prefetchProducto(p.id)}
              onClick={() => setAbierto(false)}
              className="flex items-center gap-3 border-b p-3 hover:bg-gray-100"
            >
              <img
                src={p.imageUrl}
                alt={p.nombre}
                loading="lazy"
                decoding="async"
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-gray-900">
                  {p.nombre}
                </span>
                <span className="truncate text-xs text-gray-500">
                  {p.categorias.map((c) => c.nombre).join(", ")}
                </span>
              </div>
              <span className="shrink-0 text-sm font-semibold text-blue-950">
                {formatoPrecio.format(p.precio)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Buscador;