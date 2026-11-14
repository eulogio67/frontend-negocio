import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { productoService, type Producto } from "../services/productoService";
import { useCarrito } from "../context/CarritoContext";


const WHATSAPP = import.meta.env.VITE_WHATSAPP;

const formatoPrecio = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

const PageProducto = () => {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indice, setIndice] = useState(0);
  const [agregando, setAgregando] =useState(false);


const { agregar } = useCarrito();
const [mensajeCarrito, setMensajeCarrito] = useState<string | null>(null);

const añadir = async () => {
  if (!producto || agregando) return;
  if (!localStorage.getItem("token")) {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;
    return;
  }
  setAgregando(true);
  try {
    await agregar(producto.id);
    setMensajeCarrito("Producto agregado al carrito.");
  } finally {
    setAgregando(false);
  }
};

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

  // Todas las imágenes del producto, ordenadas: la primera es la principal
  const imagenes = producto?.imagenes?.length
    ? [...producto.imagenes].sort((a, b) => a.orden - b.orden).map((i) => i.url)
    : producto?.imageUrl
    ? [producto.imageUrl]
    : [];

  const mensaje = producto
    ? encodeURIComponent(
        `Hola, me interesa ${producto.nombre} (${formatoPrecio.format(producto.precio)}). ¿Tiene stock?`
      )
    : "";

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {cargando && <p className="p-10 text-center text-gray-500">Cargando producto...</p>}

        {error && <p className="p-10 text-center text-red-600">{error}</p>}

        {!cargando && !error && !producto && (
          <div className="p-10 text-center">
            <p className="mb-4 text-gray-700">Producto no encontrado.</p>
            <Link to="/" className="text-blue-900 underline">Volver a la tienda</Link>
          </div>
        )}

        {producto && (
          <div className="grid gap-8 rounded-xl bg-white p-6 shadow-sm lg:grid-cols-2">
            {/* Columna izquierda: todas las imágenes */}
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:max-h-[560px] lg:flex-col lg:overflow-y-auto">
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

              <div className="order-1 flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-gray-50 lg:order-2">
                {imagenes.length > 0 ? (
                  <img
                    src={imagenes[indice]}
                    alt={producto.nombre}
                    className="aspect-square w-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400">Sin imagen</span>
                )}
              </div>
            </div>

            {/* Columna derecha: datos del producto */}
            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                {producto.categorias.map((c) => c.nombre).join(", ")}
              </span>
              <h1 className="text-3xl font-extrabold uppercase leading-tight text-gray-900">
                {producto.nombre}
              </h1>
              <p className="text-3xl font-bold text-blue-950">
                {formatoPrecio.format(producto.precio)}
              </p>
              <p className="text-sm text-gray-600">Stock disponible: {producto.stock}</p>
              <p className="whitespace-pre-line text-gray-700">{producto.descripcion}</p>

              <button
              type="button"
              onClick={añadir}
              disabled={agregando || producto.stock === 0}
              className="flex items-center justify-center gap-2 rounded-md border border-blue-950 px-6 py-3 font-semibold text-blue-950 hover:bg-blue-50"
              >
    <i className="fa-solid fa-cart-plus"></i>
  Agregar al carrito
</button>
{mensajeCarrito && <p className="text-center text-sm text-green-700">{mensajeCarrito}</p>}
              <Link to="/" className="text-center text-sm text-blue-900 underline">
                Seguir comprando
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PageProducto;