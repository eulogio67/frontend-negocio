import { useEffect, useState } from "react";
import { productoService } from "../services/productoService";
import type { Producto } from "../types/Producto";

const formato = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

const CuadernoVentas = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null);
  const [borrador, setBorrador] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = () =>
    productoService
      .obtenerTodos()
      .then(setProductos)
      .finally(() => setCargando(false));

  useEffect(() => {
    cargar();
  }, []);

  const abrir = (p: Producto) => {
    setSeleccionado(p);
    setBorrador(Object.fromEntries(Object.entries(p.tallas).map(([t, q]) => [t, String(q)])));
    setMensaje(null);
    setError(null);
  };

  const guardar = async () => {
    if (!seleccionado) return;
    setError(null);
    setMensaje(null);

    const tallas: Record<string, number> = {};
    for (const [t, valor] of Object.entries(borrador)) {
      if (!/^\d+$/.test(valor)) {
        setError(`Cantidad inválida para la talla ${t}.`);
        return;
      }
      tallas[t] = Number(valor);
    }

    setGuardando(true);
    try {
      const actualizado = await productoService.actualizarTallas(seleccionado.id, tallas);
      setProductos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)));
      setSeleccionado(actualizado);
      setMensaje("Cantidades guardadas.");
    } catch {
      setError("No se pudieron guardar las cantidades.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p className="text-gray-500">Cargando productos...</p>;

  return (
    <div className="flex flex-col gap-4">
      {/* Lista de productos */}
      <ul className="flex flex-col gap-3">
        {productos.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => abrir(p)}
              className={`flex w-full items-center gap-4 border bg-white p-3 text-left hover:bg-gray-50 ${
                seleccionado?.id === p.id ? "border-blue-950" : "border-gray-300"
              }`}
            >
              <img src={p.imageUrl} alt={p.nombre} className="h-16 w-16 shrink-0 object-cover" />
              <div className="flex flex-1 flex-col">
                <span className="font-semibold text-gray-900">{p.nombre}</span>
                <span className="text-sm text-gray-500">{formato.format(p.precio)}</span>
              </div>
              <span className="text-xs text-gray-500">Stock: {p.stock}</span>
            </button>
          </li>
        ))}
        {productos.length === 0 && <p className="text-sm text-gray-500">No hay productos.</p>}
      </ul>

      {/* Editor de cantidades, mismo estilo que PageProducto */}
      {seleccionado && (
        <div className="grid gap-6 border border-gray-300 bg-white p-5 sm:grid-cols-[120px_1fr]">
          <img
            src={seleccionado.imageUrl}
            alt={seleccionado.nombre}
            className="h-32 w-28 object-cover"
          />
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wide text-gray-500">
              {seleccionado.categorias.map((c) => c.nombre).join(", ")}
            </span>
            <h3 className="text-xl font-semibold uppercase text-gray-900">{seleccionado.nombre}</h3>
            <p className="text-lg font-bold text-blue-950">{formato.format(seleccionado.precio)}</p>

            <div className="flex flex-col gap-2">
              {Object.keys(borrador).map((t) => (
                <div key={t} className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-700">Talla {t}</span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={borrador[t]}
                    onChange={(e) => setBorrador((prev) => ({ ...prev, [t]: e.target.value }))}
                    className="w-24 border border-gray-400 px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {mensaje && <p className="text-sm text-green-700">{mensaje}</p>}

            <button
              type="button"
              onClick={guardar}
              disabled={guardando}
              className="w-full border border-gray-400 py-3 text-sm uppercase tracking-wide hover:bg-gray-50 disabled:opacity-60"
            >
              {guardando ? "Guardando..." : "Guardar cantidades"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuadernoVentas;