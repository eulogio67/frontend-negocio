import { useCarrito } from "../context/CarritoContext";
import type { Producto } from "../api/productos";

type Props = { producto: Producto };

const ProductCard = ({ producto }: Props) => {
  const {agregar} = useCarrito();

  return(
  <article className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
    <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
      {producto.imagen ? (
        <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
      ) : (
        <i className="fa-solid fa-image text-4xl"></i>
      )}
    </div>
    <div className="p-4 flex flex-col gap-2 flex-1">
      <p className="text-xs uppercase text-gray-500">{producto.categoria}</p>
      <h3 className="font-semibold text-gray-900">{producto.nombre}</h3>
      <p className="mt-auto text-lg font-bold text-blue-950">S/ {producto.precio.toFixed(2)}</p>
      <button onClick={agregar} className="bg-yellow-400 hover:bg-yellow-300 rounded-md py-2 font-medium">
        Agregar al carrito
      </button>
    </div>
  </article>
  )
};

export default ProductCard;