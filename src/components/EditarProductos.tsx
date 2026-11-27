import { useEffect, useRef, useState } from "react";
import { productoService } from "../services/productoService";
import { listarCategorias, type Categoria } from "../services/categoriaService";
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

const EditarProductos = () => {
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
  const [busqueda, setBusqueda] = useState("");

  // Categorías
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [menuCatAbierto, setMenuCatAbierto] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    productoService
      .obtenerTodos()
      .then(setProductos)
      .finally(() => setCargando(false));

    listarCategorias()
      .then(setCategorias)
      .catch(() => setCategorias([]));
  }, []);

  // Cerrar dropdown de categorías al hacer clic fuera
  useEffect(() => {
    const onClickFuera = (e: MouseEvent) => {
      if (!catRef.current?.contains(e.target as Node)) {
        setMenuCatAbierto(false);
      }
    };
    document.addEventListener("mousedown", onClickFuera);
    return () => document.removeEventListener("mousedown", onClickFuera);
  }, []);

  const cargarEnEditor = (p: Producto) => {
    setSeleccionado(p);
    setNombre(p.nombre);
    setDescripcion(p.descripcion);
    setPrecio(String(p.precio));
    setFilas(Object.entries(p.tallas).map(([t, q]) => crearFila(t, String(q))));
    setSeleccionadas(p.categorias.map((c) => c.id));
    setMenuCatAbierto(false);
    setMensaje(null);
    setError(null);
  };

  const abrir = async (id: number) => {
    setCargandoDetalle(true);
    try {
      const p = await productoService.obtenerPorId(id);
      if (p) {
        cargarEnEditor(p);
        if (window.innerWidth < 768) {
          setTimeout(
            () => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
            80
          );
        }
      }
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

  const toggleCategoria = (id: number) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const nombresSeleccionados = categorias
    .filter((c) => seleccionadas.includes(c.id))
    .map((c) => c.nombre);

  const guardar = async () => {
    if (!seleccionado) return;
    setError(null);
    setMensaje(null);

    if (!nombre.trim()) return setError("El nombre no puede estar vacío.");
    if (seleccionadas.length === 0) return setError("Debe seleccionar al menos una categoría.");

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
        categoriaIds: seleccionadas,
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

  const filtrados = productos.filter((p) => {
    const t = busqueda.trim().toLowerCase();
    if (!t) return true;
    return p.nombre.toLowerCase().includes(t);
  });

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1fr] md:gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Columna izquierda: buscador + lista */}
      <div className="flex flex-col gap-3">
        <div className="relative w-full">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full border border-gray-400 bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-blue-600"
          />
          {busqueda ? (
            <button
              type="button"
              onClick={() => setBusqueda("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-gray-500 hover:text-gray-900"
            >
              ✕
            </button>
          ) : (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          )}
        </div>

        <ul className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto pr-1 md:max-h-[70vh]">
          {filtrados.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => abrir(p.id)}
                className={`flex w-full items-center gap-3 border bg-white p-3 text-left hover:bg-gray-50 sm:gap-4 ${
                  seleccionado?.id === p.id ? "border-blue-950" : "border-gray-300"
                }`}
              >
                <img
                  src={p.imageUrl}
                  alt={p.nombre}
                  className="h-14 w-14 shrink-0 object-cover sm:h-16 sm:w-16"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-semibold text-gray-900">{p.nombre}</span>
                  <span className="text-sm text-gray-500">{formato.format(p.precio)}</span>
                </div>
                <span className="shrink-0 text-xs text-gray-500">Stock: {p.stock}</span>
              </button>
            </li>
          ))}

          {filtrados.length === 0 && (
            <p className="text-sm text-gray-500">
              {busqueda
                ? `No hay productos que coincidan con "${busqueda.trim()}".`
                : "No hay productos."}
            </p>
          )}
        </ul>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className="scroll-mt-4 border border-gray-300 bg-white p-4 sm:p-5 md:sticky md:top-4 md:h-fit"
      >
        {!seleccionado && !cargandoDetalle && (
          <p className="text-sm text-gray-500">Selecciona un producto para editarlo.</p>
        )}
        {cargandoDetalle && <p className="text-sm text-gray-500">Cargando producto...</p>}

        {seleccionado && !cargandoDetalle && (
          <div className="flex flex-col gap-3">
            <img
              src={seleccionado.imageUrl}
              alt={seleccionado.nombre}
              className="h-40 w-32 object-cover"
            />

            <label className="text-xs font-medium uppercase text-gray-600">Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={200}
              className="border border-gray-400 px-3 py-2 text-sm uppercase"
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

            {/* Categorías */}
            <label className="text-xs font-medium uppercase text-gray-600">Categorías</label>
            <div ref={catRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuCatAbierto((v) => !v)}
                aria-expanded={menuCatAbierto}
                className="flex w-full items-center justify-between border border-gray-400 px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                <span className={nombresSeleccionados.length ? "text-gray-900" : "text-gray-400"}>
                  {nombresSeleccionados.length
                    ? nombresSeleccionados.join(", ")
                    : "Selecciona una o más categorías"}
                </span>
                <span className="ml-2 text-gray-500">{menuCatAbierto ? "▲" : "▼"}</span>
              </button>

              {menuCatAbierto && (
                <ul className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 space-y-1 overflow-y-auto rounded-md border border-gray-200 bg-white p-2 shadow-lg">
                  {categorias.length === 0 && (
                    <li className="px-2 py-1 text-sm text-gray-500">
                      No hay categorías creadas todavía.
                    </li>
                  )}
                  {categorias.map((cat) => (
                    <li key={cat.id}>
                      <label className="flex cursor-pointer items-center gap-3 rounded px-2 py-1.5 text-sm text-gray-800 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={seleccionadas.includes(cat.id)}
                          onChange={() => toggleCategoria(cat.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-blue-500"
                        />
                        {cat.nombre}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="text-xs font-medium uppercase text-gray-600">Tallas y cantidades</p>
            <div className="flex flex-col gap-2">
              {filas.map((f, i) => (
                <div key={f.id} className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <input
                    placeholder="Talla"
                    value={f.talla}
                    onChange={(e) => actualizarFila(f.id, "talla", e.target.value)}
                    maxLength={10}
                    className="w-16 border border-gray-400 px-2 py-2 text-sm uppercase sm:w-20"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Cant."
                    value={f.cantidad}
                    onChange={(e) => actualizarFila(f.id, "cantidad", e.target.value)}
                    className="w-16 border border-gray-400 px-2 py-2 text-sm sm:w-20"
                  />
                  <button
                    type="button"
                    onClick={() => subirFila(i)}
                    aria-label="Subir"
                    className="flex h-9 w-9 items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => bajarFila(i)}
                    aria-label="Bajar"
                    className="flex h-9 w-9 items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => quitarFila(f.id)}
                    aria-label="Quitar"
                    className="flex h-9 w-9 items-center justify-center text-red-600 hover:bg-red-50"
                  >
                    ✕
                  </button>
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

export default EditarProductos;