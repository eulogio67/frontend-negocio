import { useEffect, useRef, useState } from "react";
import type { Producto } from "../types/Producto";

interface Props {
  producto: Producto;
  onAgregar: (talla: string, cantidad: number) => Promise<void>;
}

const SelectorTalla = ({ producto, onAgregar }: Props) => {
  const tallas = Object.entries(producto.tallas);
  const disponibles = tallas.filter(([, qty]) => qty > 0);
  const unica = tallas.length === 1 ? tallas[0][0] : null;

  // Si solo hay una talla, queda seleccionada desde el inicio
  const [talla, setTalla] = useState<string | null>(unica);
  const [abierto, setAbierto] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [agregando, setAgregando] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  const disponibleTalla = talla ? producto.tallas[talla] ?? 0 : 0;

  // Cierra el desplegable al hacer clic fuera
  useEffect(() => {
    const cerrar = (e: MouseEvent) => {
      if (!contenedorRef.current?.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, []);

  const elegir = (t: string) => {
    setTalla(t);
    setCantidad(1);
    setAbierto(false);
  };

  const agregar = async () => {
    if (!talla) return;
    setAgregando(true);
    try {
      await onAgregar(talla, cantidad);
      setCantidad(1);
    } finally {
      setAgregando(false);
    }
  };

  const etiqueta = talla ?? "Selecciona una talla";

  return (
    <div ref={contenedorRef} className="flex w-full flex-col gap-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-700">Talla</p>

      {/* Caso 1: una sola talla -> se muestra fija, sin desplegable */}
      {unica ? (
        <div className="flex h-12 w-full items-center border border-gray-400 px-4 text-sm text-gray-800">
          {unica}
        </div>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            className="flex h-12 w-full items-center justify-between border border-gray-400 bg-white px-4 text-left text-sm text-gray-800"
          >
            <span>{etiqueta}</span>
            <span className="text-gray-500">{abierto ? "▲" : "▼"}</span>
          </button>

          {abierto && (
            <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto border border-gray-400 bg-white shadow-lg">
              {tallas.map(([t, qty]) => (
                <li key={t}>
                  <button
                    type="button"
                    disabled={qty === 0}
                    onClick={() => elegir(t)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 disabled:line-through"
                  >
                    <span>{t}</span>
                    {qty === 0 && <span className="text-xs">Agotado</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {talla && disponibleTalla > 0 && (
        <div className="flex items-center gap-3 text-sm">
          <label className="text-gray-700">Cantidad</label>
          <input
            type="number"
            min={1}
            max={disponibleTalla}
            value={cantidad}
            onChange={(e) =>
              setCantidad(Math.min(Math.max(1, Number(e.target.value)), disponibleTalla))
            }
            className="w-20 border border-gray-400 px-2 py-1"
          />
          <span className="text-xs text-gray-500">{disponibleTalla} disponibles</span>
        </div>
      )}

      {/* Botón con la animación: el gris entra de derecha a izquierda */}
      <button
        type="button"
        onClick={agregar}
        disabled={!talla || agregando || disponibleTalla === 0}
        className="group relative h-12 w-full overflow-hidden border border-gray-400 bg-white text-sm uppercase tracking-wide text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-right scale-x-0 bg-gray-300 transition-transform duration-500 ease-out group-hover:scale-x-100 group-disabled:scale-x-0"
        />
        <span className="relative z-10">
          {agregando ? "Agregando..." : "Añadir al carrito"}
        </span>
      </button>
    </div>
  );
};

export default SelectorTalla;