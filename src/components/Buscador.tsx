import { useEffect, useState } from "react";
import { productoService, type Producto } from "../services/productoService";

const formatoPrecio = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

const useBusqueda = (texto: string, espera = 300) => {
  const [resultados, setResultados] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const termino = texto.trim();
    if (!termino) {
      setResultados([]);
      setCargando(false);
      return;
    }

    let ignorar = false; // evita que una respuesta antigua pise una más reciente

    const timer = setTimeout(async () => {
      setCargando(true);
      try {
        const data = await productoService.buscar(termino);
        if (!ignorar) setResultados(data);
      } catch {
        if (!ignorar) setResultados([]);
      } finally {
        if (!ignorar) setCargando(false);
      }
    }, espera);

    return () => {
      ignorar = true;
      clearTimeout(timer);
    };
  }, [texto, espera]);

  return { resultados, cargando };
};

const Buscador = () => {
  const [texto, setTexto] = useState("");
  const [abierto, setAbierto] = useState(false);
  const { resultados, cargando } = useBusqueda(texto);

  const mostrarPanel = abierto && texto.trim().length > 0;

  return (
    <div className="relative mx-4 flex max-w-6xl flex-1">
      <div className="flex w-full">
        <button className="flex items-center gap-2 rounded-l-md bg-gray-200 px-3 text-black">
          Todos <i className="fa-solid fa-arrow-down-long"></i>
        </button>

        <input
          type="text"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setAbierto(true);
          }}
          onFocus={() => setAbierto(true)}
          onBlur={() => setAbierto(false)}
          onKeyDown={(e) => e.key === "Escape" && setAbierto(false)}
          placeholder="Polos de Hombre"
          className="flex-1 bg-white px-3 py-2 text-black outline-none"
        />

        <button className="rounded-r-md bg-yellow-400 px-4" type="button">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      {mostrarPanel && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-md bg-white shadow-lg">
          {cargando && (
            <p className="p-4 text-sm text-gray-500">Buscando...</p>
          )}

          {!cargando && resultados.length === 0 && (
            <p className="p-4 text-sm text-gray-500">
              No encontramos productos para "{texto.trim()}".
            </p>
          )}

          {!cargando &&
            resultados.map((p) => (
              <a
                key={p.id}
                href={`#producto-${p.id}`}
                // onMouseDown se ejecuta antes del onBlur del input
                onMouseDown={(e) => e.preventDefault()}
                className="flex items-center gap-3 border-b p-3 hover:bg-gray-100"
              >
                <img
                  src={p.imageUrl}
                  alt={p.nombre}
                  className="h-12 w-12 rounded object-cover"
                />
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium text-gray-900">{p.nombre}</span>
                  <span className="text-xs text-gray-500">{p.categoria}</span>
                </div>
                <span className="text-sm font-semibold text-blue-950">
                  {formatoPrecio.format(p.precio)}
                </span>
              </a>
            ))}
        </div>
      )}
    </div>
  );
};

export default Buscador;