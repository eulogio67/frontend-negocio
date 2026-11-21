import { useEffect, useState } from "react";
import api from "../api/axios";

interface EstadoIa {
  id: number;
  nombre: string;
  imageUrl: string;
  estadoIa: "PENDIENTE" | "PROCESANDO" | "LISTO" | "ERROR";
  imagenesIa: { tipo: string; url: string; aprobada: boolean }[];
}

const COLORES: Record<EstadoIa["estadoIa"], string> = {
  PENDIENTE: "bg-gray-200 text-gray-800",
  PROCESANDO: "bg-yellow-200 text-yellow-900",
  LISTO: "bg-green-200 text-green-900",
  ERROR: "bg-red-200 text-red-900",
};

// Imagen con estado de carga/error para evitar el "blanco"
const ImagenIA = ({ src, alt }: { src: string; alt: string }) => {
  const [estado, setEstado] = useState<"cargando" | "ok" | "error">("cargando");

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {estado === "cargando" && (
        <span className="absolute text-sm text-gray-500">Cargando imagen...</span>
      )}
      {estado === "error" && (
        <span className="absolute text-sm text-red-600">No se pudo cargar la imagen</span>
      )}
      <img
        key={src}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setEstado("ok")}
        onError={() => setEstado("error")}
        className={`max-h-full max-w-full object-contain transition-opacity ${
          estado === "ok" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

const ProcesarIA = () => {
  const [productos, setProductos] = useState<EstadoIa[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);
  const [lote, setLote] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visor, setVisor] = useState<EstadoIa | null>(null);
  const [indice, setIndice] = useState(0);

  const abrirVisor = (p: EstadoIa) => {
    setVisor(p);
    setIndice(0);
  };

  // Cerrar con ESC
  useEffect(() => {
    if (!visor) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVisor(null);
      if (e.key === "ArrowRight") setIndice((i) => Math.min(i + 1, visor.imagenesIa.length - 1));
      if (e.key === "ArrowLeft") setIndice((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visor]);

  // Bloquear scroll del body mientras el visor está abierto
  useEffect(() => {
    document.body.style.overflow = visor ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visor]);

  const cargar = () =>
    api.get<EstadoIa[]>("/api/admin/productos/ia-estado").then((r) => setProductos(r.data));

  useEffect(() => {
    cargar().finally(() => setCargando(false));
  }, []);

  const pendientes = productos.filter((p) => p.estadoIa !== "LISTO" && p.estadoIa !== "PROCESANDO");

  const procesar = async (id: number) => {
    setProcesandoId(id);
    setError(null);
    try {
      await api.post(`/api/admin/productos/${id}/procesar-ia`);
      await cargar();
    } catch {
      setError("No se pudo iniciar el procesamiento.");
    } finally {
      setProcesandoId(null);
    }
  };

  const marcarProcesado = async (id: number) => {
    setProcesandoId(id);
    setError(null);
    try {
      await api.post(`/api/admin/productos/${id}/marcar-procesado`);
      await cargar();
    } catch {
      setError("No se pudo marcar el producto.");
    } finally {
      setProcesandoId(null);
    }
  };

  const procesarTodos = async () => {
    if (!confirm(`¿Procesar ${pendientes.length} productos con IA? Cada uno consume cuota.`)) return;
    setLote(true);
    setError(null);
    for (const p of pendientes) {
      try {
        await api.post(`/api/admin/productos/${p.id}/procesar-ia`);
      } catch {
        /* sigue con el siguiente */
      }
    }
    setLote(false);
    await cargar();
  };

  if (cargando) return <p className="text-gray-500">Cargando...</p>;

  if (productos.length === 0) {
    return <p className="text-sm text-gray-500">No hay productos para procesar con IA.</p>;
  }

  const imagenActual = visor?.imagenesIa[indice];

  return (
    <div className="flex flex-col gap-4">
      {pendientes.length > 0 && (
        <button
          type="button"
          onClick={procesarTodos}
          disabled={lote}
          className="w-full border border-blue-950 bg-blue-950 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
        >
          {lote ? "Procesando..." : `Iniciar procesamiento de ${pendientes.length} productos`}
        </button>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <ul className="flex flex-col gap-3">
        {productos.map((p) => {
          const bloqueado = p.estadoIa === "LISTO" || p.estadoIa === "PROCESANDO";
          const enCurso = procesandoId === p.id;

          return (
            <li
              key={p.id}
              className="flex flex-col gap-3 border border-gray-300 bg-white p-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <button
                type="button"
                onClick={() => abrirVisor(p)}
                className="shrink-0"
                aria-label={`Ver imágenes de ${p.nombre}`}
              >
                <img
                  src={p.imageUrl}
                  alt={p.nombre}
                  loading="lazy"
                  decoding="async"
                  className="h-20 w-20 object-cover sm:h-16 sm:w-16"
                />
              </button>

              <button
                type="button"
                onClick={() => abrirVisor(p)}
                className="flex min-w-0 flex-1 flex-col text-left"
              >
                <span className="truncate font-semibold text-gray-900" title={p.nombre}>
                  {p.nombre}
                </span>
                <span
                  className={`mt-1 w-fit rounded px-2 py-0.5 text-xs font-medium ${COLORES[p.estadoIa]}`}
                >
                  {p.estadoIa}
                </span>
              </button>

              {!bloqueado && (
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <button
                    type="button"
                    onClick={() => procesar(p.id)}
                    disabled={enCurso || lote}
                    className="border border-gray-400 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                  >
                    {enCurso ? "Procesando..." : "Procesar con IA"}
                  </button>
                  <button
                    type="button"
                    onClick={() => marcarProcesado(p.id)}
                    disabled={enCurso || lote}
                    className="border border-green-700 px-3 py-2 text-sm text-green-700 hover:bg-green-50 disabled:opacity-60"
                  >
                    Marcar como procesado
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* MODAL: fuera del map, uno solo, sin condición de "bloqueado" */}
      {visor && (
        <div
          className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/80 sm:items-center sm:p-6"
          onClick={() => setVisor(null)}
        >
          <div
            className="flex h-full w-full flex-col bg-white sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="truncate font-semibold text-gray-900">{visor.nombre}</span>
              <button
                type="button"
                onClick={() => setVisor(null)}
                aria-label="Cerrar"
                className="flex h-9 w-9 items-center justify-center text-2xl text-gray-700 hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <div className="flex flex-1 items-center justify-center overflow-hidden bg-gray-100 p-2">
              {visor.imagenesIa.length > 0 && imagenActual ? (
                <ImagenIA
                  src={imagenActual.url}
                  alt={`${visor.nombre} ${indice + 1}`}
                />
              ) : (
                <span className="text-sm text-gray-500">Este producto aún no tiene imágenes generadas.</span>
              )}
            </div>

            {visor.imagenesIa.length > 0 && (
              <div className="flex gap-2 overflow-x-auto border-t px-3 py-3">
                {visor.imagenesIa.map((img, i) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setIndice(i)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded border-2 ${
                      i === indice ? "border-blue-950" : "border-transparent"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                    {img.tipo === "MODELO" && (
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-center text-[9px] text-white">
                        IA
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcesarIA;