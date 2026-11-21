import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { Producto } from "../types/Producto";
import { optimizarImagen, srcSetCloudinary } from "../utils/cloudinary";

interface ProductCardProps {
  producto: Producto;
  priority?: boolean;
}

const formatoPrecio = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

// Anchos que srcSet ofrece. El navegador elige según el "sizes".
const ANCHOS = [300, 400, 600, 800];
// En carrusel móvil cada card ocupa ~80vw; en desktop grid, 25vw.
const SIZES = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw";

const ProductCard = ({ producto, priority = false }: ProductCardProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const imagenes = [...(producto.imagenes ?? [])].sort((a, b) => a.orden - b.orden);
  const principal = imagenes[0]?.url ?? producto.imageUrl;
  const segunda = imagenes[1]?.url ?? null;

  // Precarga la 2ª imagen SOLO si el dispositivo tiene hover (desktop/tablet con mouse)
  useEffect(() => {
    if (!segunda) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover)").matches) return; // móvil → no precargar

    const el = cardRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const pre = new Image();
          pre.sizes = SIZES;
          pre.srcset = srcSetCloudinary(segunda, ANCHOS);
          pre.src = optimizarImagen(segunda, { width: 400 });
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [segunda]);

  return (
    <Link
      ref={cardRef}
      to={`/producto/${producto.id}`}
      className="group block overflow-hidden rounded-lg bg-white shadow transition-shadow duration-300 hover:shadow-md"
      draggable={false}
    >
      <article className="flex flex-col">
        <div className="relative aspect-4/5 w-full overflow-hidden bg-gray-100">
          <img
            src={optimizarImagen(principal, { width: 400 })}
            srcSet={srcSetCloudinary(principal, ANCHOS)}
            sizes={SIZES}
            alt={producto.nombre}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            draggable={false}
            className="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {segunda && (
            <img
              src={optimizarImagen(segunda, { width: 400 })}
              srcSet={srcSetCloudinary(segunda, ANCHOS)}
              sizes={SIZES}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              draggable={false}
              className="absolute inset-0 h-full w-full select-none object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          <span className="text-xs uppercase tracking-wide text-gray-500">
            {producto.categorias.map((c) => c.nombre).join(", ")}
          </span>
          <h3 className="truncate font-semibold text-gray-900">{producto.nombre}</h3>
          <p className="line-clamp-2 text-sm text-gray-600">{producto.descripcion}</p>
          <p className="mt-auto pt-2 text-lg font-bold text-blue-950">
            {formatoPrecio.format(producto.precio)}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;