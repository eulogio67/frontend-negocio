import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { productoService } from "../services/productoService";
import type { Producto } from "../types/Producto";

const formato = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

// Ranking fijo de tallas de letras. Lo que no esté aquí va al final, alfabético.
const RANGO_TALLA: Record<string, number> = {
  XXS: 0,
  XS: 1,
  S: 2,
  M: 3,
  L: 4,
  XL: 5,
  XXL: 6,
  XXXL: 7,
  "4XL": 8,
  "5XL": 9,
};

const esNumero = (t: string) => /^\d+(\.\d+)?$/.test(t.trim());

const compararTallas = (a: string, b: string): number => {
  const A = a.trim().toUpperCase();
  const B = b.trim().toUpperCase();

  // 1) Ambos números → orden numérico
  if (esNumero(A) && esNumero(B)) return Number(A) - Number(B);

  // 2) Números siempre antes que letras
  if (esNumero(A)) return -1;
  if (esNumero(B)) return 1;

  // 3) Ambos en el ranking → por rango
  const rA = RANGO_TALLA[A];
  const rB = RANGO_TALLA[B];
  if (rA !== undefined && rB !== undefined) return rA - rB;

  // 4) Uno conocido y otro no → conocido primero
  if (rA !== undefined) return -1;
  if (rB !== undefined) return 1;

  // 5) Ambos desconocidos → alfabético
  return A.localeCompare(B);
};

const Vender = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [talla, setTalla] = useState<string | null>(null);
  const [vendiendo, setVendiendo] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = () => productoService.obtenerTodos().then(setProductos);

  useEffect(() => {
    cargar().finally(() => setCargando(false));
  }, []);

  // Todas las tallas con la suma de unidades, ordenadas con el comparador
  const tallas = useMemo(() => {
    const mapa = new Map<string, number>();
    productos.forEach((p) =>
      Object.entries(p.tallas).forEach(([t, q]) => {
        const clave = t.trim().toUpperCase();
        mapa.set(clave, (mapa.get(clave) ?? 0) + q);
      })
    );
    return [...mapa.entries()].sort(([a], [b]) => compararTallas(a, b));
  }, [productos]);

  // Solo productos con esa talla y stock > 0
  const filtrados = useMemo(
    () => (talla ? productos.filter((p) => (p.tallas[talla] ?? 0) > 0) : []),
    [productos, talla]
  );

  const vender = async (p: Producto) => {
    if (!talla) return;
    setVendiendo(p.id);
    setError(null);
    setMensaje(null);
    try {
      await api.post("/api/admin/ventas", { productoId: p.id, talla, cantidad: 1 });
      setMensaje(`Vendido: ${p.nombre} talla ${talla}.`);
      await cargar();
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "No se pudo registrar la venta.");
    } finally {
      setVendiendo(null);
    }
  };

  if (cargando) return <p className="text-gray-500">Cargando productos...</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {tallas.map(([t, total]) => (
          <button
            key={t}
            type="button"
            onClick={() => setTalla(t)}
            className={`border px-4 py-2 text-sm font-semibold ${
              talla === t ? "border-blue-950 bg-blue-950 text-white" : "border-gray-400 bg-white"
            }`}
          >
            {t} <span className="text-xs opacity-70">({total})</span>
          </button>
        ))}
      </div>

      {talla && (
        <p className="text-sm text-gray-600">
          Productos con talla {talla} disponible: {filtrados.length}
        </p>
      )}

      {mensaje && <p className="text-sm text-green-700">{mensaje}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <ul className="flex flex-col gap-3">
        {filtrados.map((p) => (
          <li key={p.id} className="flex items-center gap-4 border border-gray-300 bg-white p-3">
            <img src={p.imageUrl} alt={p.nombre} className="h-16 w-16 shrink-0 object-cover" />
            <div className="flex flex-1 flex-col">
              <span className="font-semibold text-gray-900">{p.nombre}</span>
              <span className="text-sm text-gray-500">{formato.format(p.precio)}</span>
              <span className="text-xs text-gray-500">Disponibles en {talla}: {p.tallas[talla!]}</span>
            </div>
            <button
              type="button"
              onClick={() => vender(p)}
              disabled={vendiendo === p.id}
              className="bg-yellow-400 px-4 py-2 text-sm font-semibold text-blue-950 hover:bg-yellow-300 disabled:opacity-60"
            >
              {vendiendo === p.id ? "Vendiendo..." : "Vender 1"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vender;