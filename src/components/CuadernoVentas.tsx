import { useEffect, useState } from "react";
import { productoService } from "../services/productoService";
import type { Producto } from "../types/Producto";

const formato = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

interface FilaTalla {
  id: string;
  talla: string;
  cantidad: string;
}

const crearFila = (talla = "", cantidad = ""): FilaTalla => ({
  id: crypto.randomUUID(),
  talla,
  cantidad,
});

const CuadernoVentas = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [filas, setFilas] = useState<FilaTalla[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    productoService
      .obtenerTodos()
      .then(setProductos)
      .finally(() => setCargando(false));
  }, []);

  const cargarEnEditor = (p: Producto) => {
    setSeleccionado(p);
    setNombre(p.nombre);
    setDescripcion(p.descripcion);
    setPrecio(String(p.precio))
    setFilas(Object.entries(p.tallas).map(([t, q]) => crearFila(t, String(q))));
    setMensaje(null);
    setError(null);
  };

  const abrir = async (id: number) => {
    setCargandoDetalle(true);
    try {
      const p = await productoService.obtenerPorId(id);
      if (p) cargarEnEditor(p);
    } catch {
      setError("No se pudo cargar el producto.");
    } finally {
      setCargandoDetalle(false);
    }
  };

  const actualizarFila = (id: string, campo: "talla" | "cantidad", valor: string) =>
    setFilas((prev) => prev.map((f) => (f.id === id ? { ...f, [campo]: valor } : f)));

  const subirFila = (i: number) =>
    setFilas((prev) => {
      if (i === 0) return prev;
      const copia = [...prev];
      [copia[i - 1], copia[i]] = [copia[i], copia[i - 1]];
      return copia;
    });

  const bajarFila = (i: number) =>
    setFilas((prev) => {
      if (i === prev.length - 1) return prev;
      const copia = [...prev];
      [copia[i], copia[i + 1]] = [copia[i + 1], copia[i]];
      return copia;
    });

  const quitarFila = (id: string) => setFilas((prev) => prev.filter((f) => f.id !== id));

  const guardar = async () => {
    if (!seleccionado) return;
    setError(null);
    setMensaje(null);

    if (!nombre.trim()) return setError("El nombre no puede estar vacío.");

    const tallas: Record<string, number> = {};
    for (const f of filas) {
      const talla = f.talla.trim().toUpperCase();
      if (!talla) continue;
      if (!/^\d+$/.test(f.cantidad)) return setError(`Cantidad inválida para la talla ${talla}.`);
      if (talla in tallas) return setError(`La talla ${talla} está repetida.`);
      tallas[talla] = Number(f.cantidad);
    }
    if (Object.keys(tallas).length === 0) return setError("Debe haber al menos una talla.");

    const precioNum = Number(precio);
    
    if (!precio || Number.isNaN(precioNum) || precioNum <= 0) {
      return setError("El precio debe ser mayor que 0.");
    }


    setGuardando(true);
    try {
      const actualizado = await productoService.actualizar(seleccionado.id, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: precioNum,
        tallas,
      });
      setProductos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)));
      cargarEnEditor(actualizado);
      setMensaje("Producto guardado.");
    } catch {
      setError("No se pudo guardar el producto.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p className="text-gray-500">Cargando productos...</p>;

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1.2fr]">
      {/* Columna izquierda: lista */}
      <ul className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto pr-1">
        {productos.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => abrir(p.id)}
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

      {/* Columna derecha: editor fijo al costado */}
      <div className="sticky top-4 h-fit border border-gray-300 bg-white p-5">
        {!seleccionado && !cargandoDetalle && (
          <p className="text-sm text-gray-500">Selecciona un producto para editarlo.</p>
        )}
        {cargandoDetalle && <p className="text-sm text-gray-500">Cargando producto...</p>}

        {seleccionado && !cargandoDetalle && (
          <div className="flex flex-col gap-3">
            <img src={seleccionado.imageUrl} alt={seleccionado.nombre} className="h-40 w-32 object-cover" />

            <label className="text-xs font-medium uppercase text-gray-600">Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={200}
              className="border border-gray-400 px-3 py-2 text-sm"
            />

            <label className="text-xs font-medium uppercase text-gray-600">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={1000}
              rows={3}
              className="border border-gray-400 px-3 py-2 text-sm"
            />

            <label className="text-xs font-medium uppercase text-gray-600">Precio (S/)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="border border-gray-400 px-3 py-2 text-sm"
            />

            <p className="text-xs font-medium uppercase text-gray-600">Tallas y cantidades</p>
            <div className="flex flex-col gap-2">
              {filas.map((f, i) => (
                <div key={f.id} className="flex items-center gap-2">
                  <input
                    placeholder="Talla"
                    value={f.talla}
                    onChange={(e) => actualizarFila(f.id, "talla", e.target.value)}
                    maxLength={10}
                    className="w-20 border border-gray-400 px-2 py-2 text-sm uppercase"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Cant."
                    value={f.cantidad}
                    onChange={(e) => actualizarFila(f.id, "cantidad", e.target.value)}
                    className="w-20 border border-gray-400 px-2 py-2 text-sm"
                  />
                  <button type="button" onClick={() => subirFila(i)} aria-label="Subir" className="px-2 text-gray-600">▲</button>
                  <button type="button" onClick={() => bajarFila(i)} aria-label="Bajar" className="px-2 text-gray-600">▼</button>
                  <button type="button" onClick={() => quitarFila(f.id)} aria-label="Quitar" className="px-2 text-red-600">✕</button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setFilas((prev) => [...prev, crearFila()])}
              className="w-fit text-sm font-medium text-blue-950 underline"
            >
              + Agregar talla
            </button>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {mensaje && <p className="text-sm text-green-700">{mensaje}</p>}

            <button
              type="button"
              onClick={guardar}
              disabled={guardando}
              className="w-full border border-gray-400 py-3 text-sm uppercase tracking-wide hover:bg-gray-50 disabled:opacity-60"
            >
              {guardando ? "Guardando..." : "Guardar producto"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CuadernoVentas;