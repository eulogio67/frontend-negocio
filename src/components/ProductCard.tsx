import type { Producto } from "../types/Producto";

interface ProductCardProps{
  producto: Producto;
}

const formatoPrecio = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});
const ProductCard = ({ producto }: ProductCardProps) => (
  <article className="flex flex-col overflow-hidden rounded-lg bg-white shadow transition hover:shadow-md">
    <img
      src={producto.imageUrl}
      alt={producto.nombre}
      className="h-56 w-full object-cover"
      loading="lazy"
    />
    <div className="flex flex-1 flex-col gap-1 p-4">
      <span className="text-xs uppercase tracking-wide text-gray-500">
        {producto.categoria}
      </span>
      <h3 className="font-semibold text-gray-900">{producto.nombre}</h3>
      <p className="line-clamp-2 text-sm text-gray-600">{producto.descripcion}</p>
      <p className="mt-auto pt-2 text-lg font-bold text-blue-950">
        {formatoPrecio.format(producto.precio)}
      </p>
    </div>
  </article>
);

export default ProductCard;
