import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import ModalImagen from "../components/ModalImagen";
import { productoService } from "../services/productoService";
import { useCarrito } from "../context/CarritoContext";
import SelectorTalla from "../components/SelectorDeTalla";
import type { Producto } from "../types/Producto";

const formatoPrecio = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

const PageProducto = () => {
  const { id } = useParams<{ id: string }>();
  const { agregar } = useCarrito();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indice, setIndice] = useState(0);
  const [mensajeCarrito, setMensajeCarrito] = useState<string | null>(null);
  const [errorCarrito, setErrorCarrito] = useState<string | null>(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalIndice, setModalIndice] = useState(0);

  const carruselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    setCargando(true);
    setError(null);
    setIndice(0);
    productoService
      .obtenerPorId(Number(id))
      .then((p) => setProducto(p ?? null))
      .catch(() => setError("No se pudo cargar el producto."))
      .finally(() => setCargando(false));
  }, [id]);

  const agregarConTalla = async (talla: string, cantidad: number) => {
    if (!producto) return;
    setMensajeCarrito(null);
    setErrorCarrito(null);
    if (!localStorage.getItem("token")) {
      window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;
      return;
    }
    try {
      await agregar(producto.id, talla, cantidad);
      setMensajeCarrito(`Agregado al carrito: ${cantidad} x talla ${talla}.`);
    } catch (e: any) {
      setErrorCarrito(e?.response?.data?.error ?? "No se pudo agregar al carrito.");
    }
  };

  const imagenes = producto?.imagenes?.length
    ? [...producto.imagenes].sort((a, b) => a.orden - b.orden).map((i) => i.url)
    : producto?.imageUrl
    ? [producto.imageUrl]
    : [];

  const abrirModal = (i: number) => {
    setModalIndice(i);
    setModalAbierto(true);
  };

  // sincroniza el índice del carrusel móvil con el scroll
  const onScrollCarrusel = () => {
    const el = carruselRef.current;
    if (!el) return;
    setIndice(Math.round(el.scrollLeft / el.clientWidth));
  };

  const irAImagen = (i: number) => {
    const el = carruselRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-6xl">
        {cargando && <p className="p-10 text-center text-gray-500">Cargando producto...</p>}
        {error && <p className="p-10 text-center text-red-600">{error}</p>}
        {!cargando && !error && !producto && (
          <div className="p-10 text-center">
            <p className="mb-4 text-gray-700">Producto no encontrado.</p>
            <Link to="/" className="text-blue-900 underline">Volver a la tienda</Link>
          </div>
        )}

        {producto && (
          <>
            {/* ========= MÓVIL: carrusel full-width ========= */}
            <div className="md:hidden">
              <div
                ref={carruselRef}
                onScroll={onScrollCarrusel}
                className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {imagenes.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => abrirModal(i)}
                    aria-label={`Ver imagen ${i + 1} en grande`}
                    className="w-full shrink-0 snap-center"
                  >
                    <img
                      src={url}
                      alt={`${producto.nombre} ${i + 1}`}
                      loading={i === 0 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : "auto"}
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {imagenes.length > 1 && (
                <div className="mt-3 flex justify-center gap-1.5">
                  {imagenes.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => irAImagen(i)}
                      aria-label={`Ir a imagen ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === indice ? "w-5 bg-blue-950" : "w-1.5 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ========= INFO + DESKTOP ========= */}
            <div className="grid gap-8 p-4 md:grid-cols-[1.5fr_1fr] md:gap-10 md:p-6">
              {/* Desktop: layout de siempre */}
              <div className="hidden gap-4 md:flex lg:flex-row">
                <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:max-h-140 lg:flex-col lg:overflow-y-auto">
                  {imagenes.map((url, i) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setIndice(i)}
                      aria-label={`Ver imagen ${i + 1}`}
                      className={`h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 bg-gray-50 ${
                        i === indice ? "border-blue-950" : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img src={url} alt="" className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => abrirModal(indice)}
                  className="order-1 flex flex-1 cursor-zoom-in items-center justify-center overflow-hidden rounded-lg bg-gray-50 lg:order-2"
                >
                  {imagenes.length > 0 ? (
                    <img
                      src={imagenes[indice]}
                      alt={producto.nombre}
                      className="aspect-square w-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-400">Sin imagen</span>
                  )}
                </button>
              </div>

              {/* Columna de datos */}
              <div className="flex flex-col gap-4">
                <nav className="text-xs text-gray-500">
                  <Link to="/" className="underline">Inicio</Link>
                  <span className="mx-2">•</span>
                  <span>{producto.categorias[0]?.nombre ?? "Productos"}</span>
                </nav>
                <h1 className="text-3xl font-extrabold uppercase leading-tight text-gray-900">
                  {producto.nombre}
                </h1>
                <p className="text-3xl font-bold text-blue-950">
                  {formatoPrecio.format(producto.precio)}
                </p>
                <p className="whitespace-pre-line text-gray-700">{producto.descripcion}</p>

                <SelectorTalla
                  key={producto.id}
                  producto={producto}
                  onAgregar={agregarConTalla}
                />

                {mensajeCarrito && (
                  <p className="text-center text-sm text-green-700">{mensajeCarrito}</p>
                )}
                {errorCarrito && (
                  <p className="text-center text-sm text-red-600">{errorCarrito}</p>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {modalAbierto && imagenes.length > 0 && (
        <ModalImagen
          imagenes={imagenes}
          indiceInicial={modalIndice}
          alt={producto?.nombre ?? ""}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </div>
  );
};

export default PageProducto;